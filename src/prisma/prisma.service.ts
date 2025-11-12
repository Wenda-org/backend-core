import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Database connection service
 * Manages Prisma Client lifecycle and provides database access throughout the app
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  /**
   * Connect to database when module initializes
   */
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  /**
   * Disconnect from database when module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('👋 Database disconnected');
  }

  /**
   * Helper method to clean database (useful for testing)
   * WARNING: Only use in development/test environments!
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production!');
    }

    // Delete in correct order to respect foreign key constraints
    await this.reviewHelpful.deleteMany();
    await this.reviewImage.deleteMany();
    await this.review.deleteMany();
    await this.tripDestination.deleteMany();
    await this.trip.deleteMany();
    await this.favorite.deleteMany();
    await this.destinationImage.deleteMany();
    await this.destination.deleteMany();
    await this.category.deleteMany();
    await this.userPreference.deleteMany();
    await this.passwordReset.deleteMany();
    await this.user.deleteMany();

    console.log('🧹 Database cleaned');
  }
}
