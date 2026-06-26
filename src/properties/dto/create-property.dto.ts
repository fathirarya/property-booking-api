import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { PropertyType } from '../../common/enums/property-type.enum';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Grand Hyatt Jakarta' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Jakarta' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Jl. Sudirman No.1, Jakarta' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.HOTEL })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiProperty({ example: 4.5, minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
