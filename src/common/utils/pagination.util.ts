import { PaginationMeta } from '../interfaces';

/**
 * Utility class for pagination calculations and metadata
 */
export class PaginationUtil {
  /**
   * Calculate pagination metadata
   */
  static getPaginationMeta(
    total: number,
    page: number,
    perPage: number,
  ): PaginationMeta {
    const totalPages = Math.ceil(total / perPage);

    return {
      currentPage: page,
      perPage,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Calculate skip value for Prisma queries
   */
  static getSkip(page: number, perPage: number): number {
    return (page - 1) * perPage;
  }

  /**
   * Get pagination parameters from query
   */
  static getPaginationParams(page: number = 1, perPage: number = 20) {
    return {
      skip: this.getSkip(page, perPage),
      take: perPage,
    };
  }
}
