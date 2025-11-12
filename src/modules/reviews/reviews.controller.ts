import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, FilterReviewsDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all reviews',
    description: 'Returns paginated list of all reviews',
  })
  async findAll(@Query() filters: FilterReviewsDto) {
    const result = await this.reviewsService.findAll(filters);
    return {
      success: true,
      ...result,
    };
  }

  @Get('destination/:destinationId')
  @ApiOperation({ 
    summary: 'Get reviews for destination',
    description: 'Returns paginated list of reviews for a specific destination',
  })
  async findByDestination(
    @Param('destinationId') destinationId: string,
    @Query() filters: FilterReviewsDto,
    @CurrentUser() user?: RequestUser,
  ) {
    const result = await this.reviewsService.findByDestination(destinationId, filters, user?.id);
    return {
      success: true,
      ...result,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Create review',
    description: 'Creates a new review for a destination',
  })
  async create(
    @CurrentUser() user: RequestUser,
    @Body() createDto: CreateReviewDto,
  ) {
    const data = await this.reviewsService.create(user.id, createDto);
    return {
      success: true,
      message: 'Review created successfully',
      data,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update review',
    description: 'Updates your own review',
  })
  async update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updateDto: UpdateReviewDto,
  ) {
    const data = await this.reviewsService.update(user.id, id, updateDto);
    return {
      success: true,
      message: 'Review updated successfully',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete review',
    description: 'Deletes your own review',
  })
  async remove(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
  ) {
    await this.reviewsService.remove(user.id, id);
    return {
      success: true,
      message: 'Review deleted successfully',
    };
  }

  @Post(':id/helpful')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Mark review as helpful',
    description: 'Toggles helpful mark on a review',
  })
  async markHelpful(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
  ) {
    const data = await this.reviewsService.markHelpful(user.id, id);
    return {
      success: true,
      message: data.marked ? 'Review marked as helpful' : 'Helpful mark removed',
      data,
    };
  }
}
