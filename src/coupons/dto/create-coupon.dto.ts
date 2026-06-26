import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CouponType } from '../../common/enums/coupon-type.enum';

export class CreateCouponDto {
  @ApiProperty({ example: 'SUMMER20' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ enum: CouponType, example: CouponType.PERCENTAGE })
  @IsEnum(CouponType)
  type: CouponType;

  @ApiProperty({ example: 20, description: 'Percentage (20 = 20%) or fixed amount in IDR' })
  @IsNumber()
  @IsPositive()
  discountValue: number;

  @ApiProperty({ example: 300000, description: 'Minimum subtotal to use this coupon' })
  @IsNumber()
  @Min(0)
  minTransaction: number;

  @ApiPropertyOptional({ example: 150000, description: 'Max discount cap — only applies to PERCENTAGE type' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxDiscount?: number;
}
