import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PropertyType } from '../../common/enums/property-type.enum';

export class FilterPropertyDto {
  @ApiPropertyOptional({ example: 'Jakarta' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ enum: PropertyType })
  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @ApiPropertyOptional({ example: 4.0, description: 'Minimum rating' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @ApiPropertyOptional({ example: 500000, description: 'Max price per night' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ example: 2, description: 'Minimum room capacity' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minCapacity?: number;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsString()
  checkInDate?: string;

  @ApiPropertyOptional({ example: '2026-07-04' })
  @IsOptional()
  @IsString()
  checkOutDate?: string;

  @ApiPropertyOptional({ example: 10, default: 10, description: 'Jumlah item per request' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Cursor dari response sebelumnya (untuk load more / infinite scroll)' })
  @IsOptional()
  @IsString()
  cursor?: string;
}
