import { IsString, IsEnum, IsOptional, IsDate, MinLength, IsISO8601 } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TripStatus } from '@prisma/client';

export class CreateTripDto {
  @ApiProperty({ example: 'Viagem a Angola Norte' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ example: 'Explorando as maravilhas do Norte de Angola' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    example: '2024-07-01',
    description: 'ISO 8601 date string',
  })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({ 
    example: '2024-07-15',
    description: 'ISO 8601 date string',
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;
}

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @ApiPropertyOptional({ 
    enum: TripStatus,
    example: 'upcoming',
  })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;
}

export class AddDestinationToTripDto {
  @ApiProperty({ example: 'uuid-of-destination' })
  @IsString()
  destinationId: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  dayNumber?: number;

  @ApiPropertyOptional({ example: 'Visitar pela manhã' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTripDestinationDto {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  dayNumber?: number;

  @ApiPropertyOptional({ example: 'Visitar no final da tarde' })
  @IsOptional()
  @IsString()
  notes?: string;
}
