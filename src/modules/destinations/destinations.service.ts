import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDestinationDto, UpdateDestinationDto, FilterDestinationsDto } from './dto/destination.dto';
import { PaginationUtil } from '../../common/utils/pagination.util';

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * List destinations with filters and pagination
   */
  async findAll(filters: FilterDestinationsDto, userId?: string) {
    const { page, perPage, category, search, province, minRating, latitude, longitude, maxDistance, sortBy } = filters;
    
    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    // Filter by category
    if (category) {
      const cat = await this.prisma.category.findFirst({
        where: { OR: [{ id: category }, { slug: category }] },
      });
      if (cat) where.categoryId = cat.id;
    }

    // Filter by province
    if (province) {
      where.province = { contains: province, mode: 'insensitive' };
    }

    // Filter by minimum rating
    if (minRating) {
      where.rating = { gte: minRating };
    }

    // Search in name, description, location
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Pagination
    const { skip, take } = PaginationUtil.getPaginationParams(page, perPage);

    // Order by
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'rating') orderBy = { rating: 'desc' };
    if (sortBy === 'name') orderBy = { name: 'asc' };

    const [destinations, total] = await Promise.all([
      this.prisma.destination.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: true,
          images: {
            where: { isMain: true },
            take: 1,
          },
          _count: {
            select: { reviews: true, favorites: true },
          },
        },
      }),
      this.prisma.destination.count({ where }),
    ]);

    // Check favorites if user is logged in
    const favoritedIds = userId
      ? await this.prisma.favorite
          .findMany({
            where: { userId, destinationId: { in: destinations.map((d) => d.id) } },
            select: { destinationId: true },
          })
          .then((favs) => favs.map((f) => f.destinationId))
      : [];

    // Format response with distance calculation if coordinates provided
    const formatted = destinations.map((dest) => {
      const distance = latitude && longitude
        ? this.calculateDistance(latitude, longitude, Number(dest.latitude), Number(dest.longitude))
        : null;

      return {
        id: dest.id,
        name: dest.name,
        slug: dest.slug,
        description: dest.description,
        location: dest.location,
        province: dest.province,
        category: {
          id: dest.category.id,
          name: dest.category.name,
          slug: dest.category.slug,
        },
        rating: Number(dest.rating),
        reviewCount: dest._count.reviews,
        favoriteCount: dest._count.favorites,
        imageUrl: dest.images[0]?.url || null,
        coordinate: {
          latitude: Number(dest.latitude),
          longitude: Number(dest.longitude),
        },
        distance,
        isFavorite: favoritedIds.includes(dest.id),
        isFeatured: dest.isFeatured,
        openingHours: dest.openingHours,
        ticketPrice: dest.ticketPrice,
      };
    });

    // Sort by distance if requested and coordinates provided
    if (sortBy === 'distance' && latitude && longitude) {
      formatted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Filter by max distance if specified
    const filtered = maxDistance && latitude && longitude
      ? formatted.filter((d) => d.distance && d.distance <= maxDistance)
      : formatted;

    return {
      data: formatted,
      meta: PaginationUtil.getPaginationMeta(total, page || 1, perPage || 20),
    };
  }

  /**
   * Get single destination by ID or slug
   */
  async findOne(idOrSlug: string, userId?: string) {
    const destination = await this.prisma.destination.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        isActive: true,
        deletedAt: null,
      },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { reviews: true, favorites: true, tripDestinations: true },
        },
      },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    // Increment view count
    await this.prisma.destination.update({
      where: { id: destination.id },
      data: { viewCount: { increment: 1 } },
    });

    // Check if user favorited
    const isFavorite = userId
      ? !!(await this.prisma.favorite.findUnique({
          where: {
            userId_destinationId: {
              userId,
              destinationId: destination.id,
            },
          },
        }))
      : false;

    // Get nearby destinations
    const nearby = await this.findNearby(
      Number(destination.latitude),
      Number(destination.longitude),
      destination.id,
      5,
    );

    return {
      id: destination.id,
      name: destination.name,
      slug: destination.slug,
      description: destination.description,
      longDescription: destination.longDescription,
      location: destination.location,
      province: destination.province,
      address: destination.address,
      category: {
        id: destination.category.id,
        name: destination.category.name,
        slug: destination.category.slug,
      },
      rating: Number(destination.rating),
      reviewCount: destination._count.reviews,
      favoriteCount: destination._count.favorites,
      viewCount: destination.viewCount,
      images: destination.images.map((img) => ({
        id: img.id,
        url: img.url,
        thumbnailUrl: img.thumbnailUrl,
        caption: img.caption,
        isMain: img.isMain,
      })),
      coordinate: {
        latitude: Number(destination.latitude),
        longitude: Number(destination.longitude),
      },
      openingHours: destination.openingHours,
      ticketPrice: destination.ticketPrice,
      contact: {
        phone: destination.phone,
        email: destination.email,
        website: destination.website,
      },
      amenities: destination.amenities,
      accessibility: destination.accessibility,
      isFavorite,
      isFeatured: destination.isFeatured,
      nearbyDestinations: nearby,
      createdAt: destination.createdAt,
      updatedAt: destination.updatedAt,
    };
  }

  /**
   * Get featured destinations
   */
  async findFeatured(limit: number = 10) {
    const destinations = await this.prisma.destination.findMany({
      where: {
        isFeatured: true,
        isActive: true,
        deletedAt: null,
      },
      take: limit,
      orderBy: { rating: 'desc' },
      include: {
        category: true,
        images: { where: { isMain: true }, take: 1 },
      },
    });

    return destinations.map((dest) => ({
      id: dest.id,
      name: dest.name,
      slug: dest.slug,
      location: dest.location,
      province: dest.province,
      category: dest.category.name,
      rating: Number(dest.rating),
      imageUrl: dest.images[0]?.url || null,
      coordinate: {
        latitude: Number(dest.latitude),
        longitude: Number(dest.longitude),
      },
    }));
  }

  /**
   * Get recommended destinations (based on user preferences or popular)
   */
  async findRecommended(limit: number = 10, userId?: string) {
    // TODO: Implement ML-based recommendations using user preferences
    // For now, return most popular destinations
    const destinations = await this.prisma.destination.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      take: limit,
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      include: {
        category: true,
        images: { where: { isMain: true }, take: 1 },
      },
    });

    return destinations.map((dest) => ({
      id: dest.id,
      name: dest.name,
      slug: dest.slug,
      location: dest.location,
      category: dest.category.name,
      rating: Number(dest.rating),
      reviewCount: dest.reviewCount,
      imageUrl: dest.images[0]?.url || null,
      recommendationReason: 'Highly rated',
    }));
  }

  /**
   * Find nearby destinations
   */
  async findNearby(latitude: number, longitude: number, excludeId?: string, limit: number = 5) {
    const destinations = await this.prisma.destination.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
      include: {
        images: { where: { isMain: true }, take: 1 },
      },
    });

    const withDistance = destinations.map((dest) => ({
      id: dest.id,
      name: dest.name,
      slug: dest.slug,
      imageUrl: dest.images[0]?.url || null,
      distance: this.calculateDistance(
        latitude,
        longitude,
        Number(dest.latitude),
        Number(dest.longitude),
      ),
    }));

    return withDistance.sort((a, b) => a.distance - b.distance).slice(0, limit);
  }

  /**
   * Create destination (Admin only)
   */
  async create(createDto: CreateDestinationDto) {
    // Check if slug exists
    const existing = await this.prisma.destination.findUnique({
      where: { slug: createDto.slug },
    });

    if (existing) {
      throw new ConflictException('Destination with this slug already exists');
    }

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const destination = await this.prisma.destination.create({
      data: {
        ...createDto,
        latitude: createDto.latitude,
        longitude: createDto.longitude,
      },
    });

    return destination;
  }

  /**
   * Update destination (Admin only)
   */
  async update(id: string, updateDto: UpdateDestinationDto) {
    const existing = await this.prisma.destination.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Destination not found');
    }

    const destination = await this.prisma.destination.update({
      where: { id },
      data: updateDto,
    });

    return destination;
  }

  /**
   * Delete destination (Admin only - soft delete)
   */
  async remove(id: string) {
    const existing = await this.prisma.destination.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Destination not found');
    }

    await this.prisma.destination.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    return { deleted: true };
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   * Returns distance in kilometers
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
