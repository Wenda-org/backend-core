import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Returns the health status of the API and database connection',
  })
  async check() {
    return this.healthService.check();
  }

  @Get('database')
  @ApiOperation({
    summary: 'Database health check',
    description: 'Returns the health status of the database connection',
  })
  async checkDatabase() {
    return this.healthService.checkDatabase();
  }
}
