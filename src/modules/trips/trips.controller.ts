import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto, UpdateTripDto, AddDestinationToTripDto, UpdateTripDestinationDto } from './dto/trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces';

@ApiTags('Trips')
@Controller('trips')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get trips',
    description: 'Returns list of user\'s trips',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    const data = await this.tripsService.findAll(user.id);
    return {
      success: true,
      data,
      meta: {
        total: data.length,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get trip details',
    description: 'Returns detailed information about a specific trip',
  })
  async findOne(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
  ) {
    const data = await this.tripsService.findOne(user.id, id);
    return {
      success: true,
      data,
    };
  }

  @Post()
  @ApiOperation({ 
    summary: 'Create trip',
    description: 'Creates a new trip itinerary',
  })
  async create(
    @CurrentUser() user: RequestUser,
    @Body() createDto: CreateTripDto,
  ) {
    const data = await this.tripsService.create(user.id, createDto);
    return {
      success: true,
      message: 'Trip created successfully',
      data,
    };
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update trip',
    description: 'Updates trip information',
  })
  async update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updateDto: UpdateTripDto,
  ) {
    const data = await this.tripsService.update(user.id, id, updateDto);
    return {
      success: true,
      message: 'Trip updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete trip',
    description: 'Deletes a trip',
  })
  async remove(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
  ) {
    await this.tripsService.remove(user.id, id);
    return {
      success: true,
      message: 'Trip deleted successfully',
    };
  }

  @Post(':id/destinations')
  @ApiOperation({ 
    summary: 'Add destination to trip',
    description: 'Adds a destination to the trip itinerary',
  })
  async addDestination(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() addDto: AddDestinationToTripDto,
  ) {
    const data = await this.tripsService.addDestination(user.id, id, addDto);
    return {
      success: true,
      message: 'Destination added to trip',
      data,
    };
  }

  @Put(':id/destinations/:destinationId')
  @ApiOperation({ 
    summary: 'Update trip destination',
    description: 'Updates destination details within a trip (day number, notes)',
  })
  async updateDestination(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Param('destinationId') destinationId: string,
    @Body() updateDto: UpdateTripDestinationDto,
  ) {
    const data = await this.tripsService.updateDestination(user.id, id, destinationId, updateDto);
    return {
      success: true,
      message: 'Trip destination updated',
      data,
    };
  }

  @Delete(':id/destinations/:destinationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Remove destination from trip',
    description: 'Removes a destination from the trip',
  })
  async removeDestination(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Param('destinationId') destinationId: string,
  ) {
    await this.tripsService.removeDestination(user.id, id, destinationId);
    return {
      success: true,
      message: 'Destination removed from trip',
    };
  }
}
