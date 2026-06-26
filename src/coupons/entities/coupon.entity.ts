import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CouponType } from '../../common/enums/coupon-type.enum';

@Entity('coupons')
export class Coupon {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'NEWUSER10' })
  @Column({ length: 50, unique: true })
  code: string;

  @ApiProperty({ enum: CouponType, example: CouponType.PERCENTAGE })
  @Column({ type: 'enum', enum: CouponType })
  type: CouponType;

  @ApiProperty({ example: 10, description: 'Percentage (10 = 10%) or fixed amount in IDR' })
  @Column({ name: 'discount_value', type: 'decimal', precision: 15, scale: 2 })
  discountValue: number;

  @ApiProperty({ example: 500000, description: 'Minimum subtotal to use this coupon' })
  @Column({ name: 'min_transaction', type: 'decimal', precision: 15, scale: 2 })
  minTransaction: number;

  @ApiProperty({ example: 100000, nullable: true, description: 'Max discount cap (for PERCENTAGE type)' })
  @Column({ name: 'max_discount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxDiscount: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
