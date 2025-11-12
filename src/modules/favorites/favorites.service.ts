import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddFavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user's favorites
   */
  async findAll(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        destination: {
          include: {
            category: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
            _count: {
              select: { reviews: true },
            },
          },
        },
      },
    });

    return favorites.map((fav) => ({
      id: fav.id,
      destination: {
        id: fav.destination.id,
        name: fav.destination.name,
        slug: fav.destination.slug,
        description: fav.destination.description,
        province: fav.destination.province,
        location: fav.destination.location,
        rating: fav.destination.rating,
        reviewCount: fav.destination._count.reviews,
        latitude: fav.destination.latitude,
        longitude: fav.destination.longitude,
        category: {
          id: fav.destination.category.id,
          name: fav.destination.category.name,
          slug: fav.destination.category.slug,
        },
        coverImage: fav.destination.images[0] || null,
        isFeatured: fav.destination.isFeatured,
      },
      addedAt: fav.createdAt,
    }));
  }

  /**
   * Add destination to favorites
   */
  async add(userId: string, addDto: AddFavoriteDto) {
    // Verify destination exists
    const destination = await this.prisma.destination.findUnique({
      where: { id: addDto.destinationId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    // Check if already favorited
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_destinationId: {
          userId,
          destinationId: addDto.destinationId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Destination already in favorites');
    }

    // Create favorite
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        destinationId: addDto.destinationId,
      },
      include: {
        destination: {
          include: {
            category: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
    });

    return {
      id: favorite.id,
      destination: {
        id: favorite.destination.id,
        name: favorite.destination.name,
        slug: favorite.destination.slug,
        category: favorite.destination.category,
        coverImage: favorite.destination.images[0] || null,
      },
      addedAt: favorite.createdAt,
    };
  }

  /**
   * Remove destination from favorites
   */
  async remove(userId: string, destinationId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_destinationId: {
          userId,
          destinationId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: { id: favorite.id },
    });

    return { deleted: true };
  }

  /**
   * Check if destination is favorited by user
   */
  async isFavorite(userId: string, destinationId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_destinationId: {
          userId,
          destinationId,
        },
      },
    });

    return !!favorite;
  }

  /**
   * Get favorite IDs for multiple destinations (for list views)
   */
  async getFavoriteIds(userId: string, destinationIds: string[]): Promise<string[]> {
    if (!destinationIds.length) return [];

    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId,
        destinationId: { in: destinationIds },
      },
      select: { destinationId: true },
    });

    return favorites.map((f) => f.destinationId);
  }
}
