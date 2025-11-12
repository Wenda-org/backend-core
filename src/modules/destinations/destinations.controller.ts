import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto, UpdateDestinationDto, FilterDestinationsDto } from './dto/destination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces';

@ApiTags('Destinations')
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'List all destinations',
    description: 'Returns paginated list of destinations with optional filters',
  })
  async findAll(
    @Query() filters: FilterDestinationsDto,
    @CurrentUser() user?: RequestUser,
  ) {
    const result = await this.destinationsService.findAll(filters, user?.id);
    return {
      success: true,
      ...result,
    };
  }

  @Get('featured')
  @ApiOperation({ 
    summary: 'Get featured destinations',
    description: 'Returns destinations marked as featured',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findFeatured(@Query('limit') limit?: number) {
    const data = await this.destinationsService.findFeatured(limit ? +limit : 10);
    return {
      success: true,
      data,
    };
  }

  @Get('recommended')
  @ApiOperation({ 
    summary: 'Get recommended destinations',
    description: 'Returns personalized recommendations or popular destinations',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findRecommended(
    @Query('limit') limit?: number,
    @CurrentUser() user?: RequestUser,
  ) {
    const data = await this.destinationsService.findRecommended(limit ? +limit : 10, user?.id);
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get destination by ID or slug',
    description: 'Returns detailed information about a destination',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user?: RequestUser,
  ) {
    const data = await this.destinationsService.findOne(id, user?.id);
    return {
      success: true,
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Create destination',
    description: 'Creates a new destination (Admin only)',
  })
  async create(@Body() createDto: CreateDestinationDto) {
    const data = await this.destinationsService.create(createDto);
    return {
      success: true,
      message: 'Destination created successfully',
      data,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update destination',
    description: 'Updates an existing destination (Admin only)',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDestinationDto,
  ) {
    const data = await this.destinationsService.update(id, updateDto);
    return {
      success: true,
      message: 'Destination updated successfully',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete destination',
    description: 'Soft deletes a destination (Admin only)',
  })
  async remove(@Param('id') id: string) {
    await this.destinationsService.remove(id);
    return {
      success: true,
      message: 'Destination deleted successfully',
    };
  }
}
