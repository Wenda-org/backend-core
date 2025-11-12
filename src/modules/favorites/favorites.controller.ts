import { Controller, Get, Post, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get favorites',
    description: 'Returns list of user\'s favorite destinations',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    const data = await this.favoritesService.findAll(user.id);
    return {
      success: true,
      data,
      meta: {
        total: data.length,
      },
    };
  }

  @Post()
  @ApiOperation({ 
    summary: 'Add to favorites',
    description: 'Adds a destination to favorites',
  })
  async add(
    @CurrentUser() user: RequestUser,
    @Body() addDto: AddFavoriteDto,
  ) {
    const data = await this.favoritesService.add(user.id, addDto);
    return {
      success: true,
      message: 'Destination added to favorites',
      data,
    };
  }

  @Delete(':destinationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Remove from favorites',
    description: 'Removes a destination from favorites',
  })
  async remove(
    @CurrentUser() user: RequestUser,
    @Param('destinationId') destinationId: string,
  ) {
    await this.favoritesService.remove(user.id, destinationId);
    return {
      success: true,
      message: 'Destination removed from favorites',
    };
  }

  @Get('check/:destinationId')
  @ApiOperation({ 
    summary: 'Check if favorited',
    description: 'Checks if a destination is in user\'s favorites',
  })
  async checkFavorite(
    @CurrentUser() user: RequestUser,
    @Param('destinationId') destinationId: string,
  ) {
    const isFavorited = await this.favoritesService.isFavorite(user.id, destinationId);
    return {
      success: true,
      data: { isFavorited },
    };
  }
}
