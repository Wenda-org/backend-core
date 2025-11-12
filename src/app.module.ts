import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DestinationsModule } from './modules/destinations/destinations.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { TripsModule } from './modules/trips/trips.module';

@Module({
  imports: [
    // Environment configuration - loads .env file
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
      envFilePath: '.env',
    }),

    // Database - Prisma ORM
    PrismaModule,

    // Feature modules
    HealthModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    DestinationsModule,
    ReviewsModule,
    FavoritesModule,
    TripsModule,
  ],
})
export class AppModule {}
