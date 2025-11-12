import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto, FilterReviewsDto } from './dto/review.dto';
import { PaginationUtil } from '../../common/utils/pagination.util';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get reviews for a destination
   */
  async findByDestination(destinationId: string, filters: FilterReviewsDto, userId?: string) {
    const { page, perPage, sortBy } = filters;

    // Verify destination exists
    const destination = await this.prisma.destination.findUnique({
      where: { id: destinationId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    const where = {
      destinationId,
      deletedAt: null,
    };

    // Order by
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'rating') orderBy = { rating: 'desc' };
    if (sortBy === 'helpful') orderBy = { helpfulCount: 'desc' };

    const { skip, take } = PaginationUtil.getPaginationParams(page, perPage);

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    // Check which reviews current user marked as helpful
    const helpfulIds = userId
      ? await this.prisma.reviewHelpful
          .findMany({
            where: { userId, reviewId: { in: reviews.map((r) => r.id) } },
            select: { reviewId: true },
          })
          .then((items) => items.map((i) => i.reviewId))
      : [];

    const formatted = reviews.map((review) => ({
      id: review.id,
      user: {
        id: review.user.id,
        name: review.user.name,
        avatarUrl: review.user.avatarUrl,
      },
      rating: review.rating,
      comment: review.comment,
      images: review.images.map((img) => ({
        id: img.id,
        url: img.url,
        thumbnailUrl: img.thumbnailUrl,
      })),
      helpfulCount: review.helpfulCount,
      isHelpful: helpfulIds.includes(review.id),
      isVerified: review.isVerified,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    return {
      data: formatted,
      meta: PaginationUtil.getPaginationMeta(total, page || 1, perPage || 20),
    };
  }

  /**
   * Create review
   */
  async create(userId: string, createDto: CreateReviewDto) {
    // Verify destination exists
    const destination = await this.prisma.destination.findUnique({
      where: { id: createDto.destinationId },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    // Check if user already reviewed this destination
    const existing = await this.prisma.review.findUnique({
      where: {
        userId_destinationId: {
          userId,
          destinationId: createDto.destinationId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this destination');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        userId,
        destinationId: createDto.destinationId,
        rating: createDto.rating,
        comment: createDto.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update destination rating and review count
    await this.updateDestinationRating(createDto.destinationId);

    return {
      id: review.id,
      user: review.user,
      rating: review.rating,
      comment: review.comment,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
    };
  }

  /**
   * Update review (own review only)
   */
  async update(userId: string, reviewId: string, updateDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: updateDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update destination rating if rating changed
    if (updateDto.rating !== undefined) {
      await this.updateDestinationRating(review.destinationId);
    }

    return updated;
  }

  /**
   * Delete review (own review only)
   */
  async remove(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    // Soft delete
    await this.prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });

    // Update destination rating
    await this.updateDestinationRating(review.destinationId);

    return { deleted: true };
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if already marked
    const existing = await this.prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (existing) {
      // Unmark - remove helpful
      await this.prisma.reviewHelpful.delete({
        where: { id: existing.id },
      });

      // Decrement count
      await this.prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { decrement: 1 } },
      });

      return { marked: false, helpfulCount: review.helpfulCount - 1 };
    } else {
      // Mark as helpful
      await this.prisma.reviewHelpful.create({
        data: {
          reviewId,
          userId,
        },
      });

      // Increment count
      await this.prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      });

      return { marked: true, helpfulCount: review.helpfulCount + 1 };
    }
  }

  /**
   * Update destination rating and review count
   */
  private async updateDestinationRating(destinationId: string) {
    const stats = await this.prisma.review.aggregate({
      where: {
        destinationId,
        deletedAt: null,
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    await this.prisma.destination.update({
      where: { id: destinationId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.id,
      },
    });
  }
}
