import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Deluxe King Room' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2, description: 'Max number of guests' })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 500000, description: 'Price per night in IDR' })
  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @ApiProperty({ example: 10, description: 'Total units available' })
  @IsInt()
  @Min(1)
  totalUnit: number;
}
