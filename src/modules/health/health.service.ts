import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async check() {
    const startTime = Date.now();

    // Check database connection
    let dbStatus = 'healthy';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbStatus = 'unhealthy';
    }

    const responseTime = Date.now() - startTime;

    return {
      success: true,
      data: {
        status: dbStatus === 'healthy' ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: {
          status: dbStatus,
          responseTime: `${responseTime}ms`,
        },
        version: '1.0.0',
      },
    };
  }

  async checkDatabase() {
    const startTime = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          status: 'healthy',
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      return {
        success: false,
        data: {
          status: 'unhealthy',
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
          error: error.message,
        },
      };
    }
  }
}
