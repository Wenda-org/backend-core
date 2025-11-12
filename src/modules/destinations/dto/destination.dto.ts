import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsDecimal, MinLength, MaxLength, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDestinationDto {
  @ApiProperty({ example: 'Fortaleza de São Miguel' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'fortaleza-sao-miguel' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  slug: string;

  @ApiProperty({ example: 'Historic fortress with city views' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'Detailed history of the fortress...' })
  @IsOptional()
  @IsString()
  longDescription?: string;

  @ApiProperty({ example: 'Luanda' })
  @IsString()
  @MaxLength(100)
  location: string;

  @ApiProperty({ example: 'Luanda' })
  @IsString()
  @MaxLength(50)
  province: string;

  @ApiPropertyOptional({ example: 'Rua da Fortaleza, 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: -8.8057 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 13.2343 })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 'Mon-Sat: 9:00 AM - 5:00 PM' })
  @IsOptional()
  @IsString()
  openingHours?: string;

  @ApiPropertyOptional({ example: '500 Kz' })
  @IsOptional()
  @IsString()
  ticketPrice?: string;

  @ApiPropertyOptional({ example: '+244 123 456 789' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'info@fortaleza.ao' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'https://fortaleza.ao' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: ['parking', 'wifi', 'restaurant'] })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional({ example: ['wheelchair', 'elevator'] })
  @IsOptional()
  @IsArray()
  accessibility?: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class UpdateDestinationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  longDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  openingHours?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ticketPrice?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  accessibility?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class FilterDestinationsDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  perPage?: number = 20;

  @ApiPropertyOptional({ description: 'Category slug or ID' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Search in name, description, location' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Province name' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: 'Minimum rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ description: 'User latitude for distance calculation' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'User longitude for distance calculation' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Maximum distance in km', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxDistance?: number;

  @ApiPropertyOptional({ 
    description: 'Sort by field',
    enum: ['distance', 'rating', 'name', 'createdAt']
  })
  @IsOptional()
  @IsEnum(['distance', 'rating', 'name', 'createdAt'])
  sortBy?: 'distance' | 'rating' | 'name' | 'createdAt';
}
