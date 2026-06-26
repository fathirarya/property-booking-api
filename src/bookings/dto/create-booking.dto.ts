import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: 'uuid-room-id' })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2026-07-04' })
  @IsDateString()
  checkOutDate: string;

  @ApiPropertyOptional({ example: 'NEWUSER10' })
  @IsOptional()
  @IsString()
  couponCode?: string;
}
