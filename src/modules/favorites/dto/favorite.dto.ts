import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiProperty({ example: 'uuid-of-destination' })
  @IsString()
  destinationId: string;
}
