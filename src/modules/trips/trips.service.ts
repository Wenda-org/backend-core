import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTripDto, UpdateTripDto, AddDestinationToTripDto, UpdateTripDestinationDto } from './dto/trip.dto';
import { TripStatus } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user's trips
   */
  async findAll(userId: string) {
    const trips = await this.prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        tripDestinations: {
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
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return trips.map((trip) => ({
      id: trip.id,
      name: trip.name,
      notes: trip.notes,
      status: trip.status,
      startDate: trip.startDate,
      endDate: trip.endDate,
      destinationCount: trip.tripDestinations.length,
      destinations: trip.tripDestinations.map((td) => ({
        id: td.destination.id,
        name: td.destination.name,
        slug: td.destination.slug,
        province: td.destination.province,
        location: td.destination.location,
        category: td.destination.category,
        coverImage: td.destination.images[0] || null,
        displayOrder: td.displayOrder,
        visitDate: td.visitDate,
        notes: td.notes,
        addedAt: td.createdAt,
      })),
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    }));
  }

  /**
   * Get trip by ID
   */
  async findOne(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        tripDestinations: {
          include: {
            destination: {
              include: {
                category: true,
                images: true,
                reviews: {
                  where: { deletedAt: null },
                  take: 5,
                  orderBy: { createdAt: 'desc' },
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: trip.id,
      name: trip.name,
      notes: trip.notes,
      status: trip.status,
      startDate: trip.startDate,
      endDate: trip.endDate,
      destinations: trip.tripDestinations.map((td) => ({
        destination: {
          id: td.destination.id,
          name: td.destination.name,
          slug: td.destination.slug,
          description: td.destination.description,
          province: td.destination.province,
          location: td.destination.location,
          latitude: td.destination.latitude,
          longitude: td.destination.longitude,
          rating: td.destination.rating,
          reviewCount: td.destination.reviews.length,
          category: td.destination.category,
          images: td.destination.images,
        },
        displayOrder: td.displayOrder,
        visitDate: td.visitDate,
        notes: td.notes,
        addedAt: td.createdAt,
      })),
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }

  /**
   * Create trip
   */
  async create(userId: string, createDto: CreateTripDto) {
    const trip = await this.prisma.trip.create({
      data: {
        userId,
        name: createDto.name,
        notes: createDto.description,
        startDate: createDto.startDate ? new Date(createDto.startDate) : new Date(),
        endDate: createDto.endDate ? new Date(createDto.endDate) : new Date(),
      },
    });

    return trip;
  }

  /**
   * Update trip
   */
  async update(userId: string, tripId: string, updateDto: UpdateTripDto) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const data: any = {};
    if (updateDto.name) data.name = updateDto.name;
    if (updateDto.description !== undefined) data.notes = updateDto.description;
    if (updateDto.status) data.status = updateDto.status;
    if (updateDto.startDate) data.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate) data.endDate = new Date(updateDto.endDate);

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data,
    });

    return updated;
  }

  /**
   * Delete trip
   */
  async remove(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.trip.delete({
      where: { id: tripId },
    });

    return { deleted: true };
  }

  /**
   * Add destination to trip
   */
  async addDestination(userId: string, tripId: string, addDto: AddDestinationToTripDto) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Verify destination exists
    const destination = await this.prisma.destination.findUnique({
      where: { id: addDto.destinationId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    // Check if already added
    const existing = await this.prisma.tripDestination.findUnique({
      where: {
        tripId_destinationId: {
          tripId,
          destinationId: addDto.destinationId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Destination already in trip');
    }

    const tripDestination = await this.prisma.tripDestination.create({
      data: {
        tripId,
        destinationId: addDto.destinationId,
        displayOrder: addDto.dayNumber || 0,
        notes: addDto.notes,
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
      destination: tripDestination.destination,
      displayOrder: tripDestination.displayOrder,
      visitDate: tripDestination.visitDate,
      notes: tripDestination.notes,
      addedAt: tripDestination.createdAt,
    };
  }

  /**
   * Update trip destination
   */
  async updateDestination(
    userId: string,
    tripId: string,
    destinationId: string,
    updateDto: UpdateTripDestinationDto,
  ) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const tripDestination = await this.prisma.tripDestination.findUnique({
      where: {
        tripId_destinationId: {
          tripId,
          destinationId,
        },
      },
    });

    if (!tripDestination) {
      throw new NotFoundException('Destination not in trip');
    }

    const data: any = {};
    if (updateDto.dayNumber !== undefined) data.displayOrder = updateDto.dayNumber;
    if (updateDto.notes !== undefined) data.notes = updateDto.notes;

    const updated = await this.prisma.tripDestination.update({
      where: { id: tripDestination.id },
      data,
    });

    return updated;
  }

  /**
   * Remove destination from trip
   */
  async removeDestination(userId: string, tripId: string, destinationId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const tripDestination = await this.prisma.tripDestination.findUnique({
      where: {
        tripId_destinationId: {
          tripId,
          destinationId,
        },
      },
    });

    if (!tripDestination) {
      throw new NotFoundException('Destination not in trip');
    }

    await this.prisma.tripDestination.delete({
      where: { id: tripDestination.id },
    });

    return { deleted: true };
  }
}
