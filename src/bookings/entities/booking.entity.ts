import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { Room } from '../../rooms/entities/room.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { BookingStatusHistory } from './booking-status-history.entity';

@Entity('bookings')
export class Booking {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'BK-ABC12345' })
  @Column({ name: 'booking_code', length: 20, unique: true })
  bookingCode: string;

  @ApiProperty({ example: 'John Doe' })
  @Column({ name: 'customer_name', length: 255 })
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ name: 'customer_email', length: 255 })
  customerEmail: string;

  @ApiProperty({ example: 'uuid-v4' })
  @Index()
  @Column({ name: 'room_id' })
  roomId: string;

  @ApiProperty({ example: '2026-07-01' })
  @Column({ name: 'check_in_date', type: 'date' })
  checkInDate: string;

  @ApiProperty({ example: '2026-07-04' })
  @Column({ name: 'check_out_date', type: 'date' })
  checkOutDate: string;

  @ApiProperty({ example: 3 })
  @Column({ name: 'total_nights', type: 'int' })
  totalNights: number;

  @ApiProperty({ example: 1500000 })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: number;

  @ApiProperty({ example: 150000, description: 'Auto 10% discount for stay >= 3 nights' })
  @Column({ name: 'auto_discount_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  autoDiscountAmount: number;

  @ApiProperty({ example: 100000 })
  @Column({ name: 'coupon_discount_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  couponDiscountAmount: number;

  @ApiProperty({ example: 1250000 })
  @Column({ name: 'final_price', type: 'decimal', precision: 15, scale: 2 })
  finalPrice: number;

  @ApiProperty({ enum: BookingStatus, example: BookingStatus.PENDING })
  @Index()
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ name: 'coupon_id', nullable: true })
  couponId: string | null;

  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Coupon, { nullable: true })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon | null;

  @OneToMany(() => BookingStatusHistory, (history) => history.booking)
  statusHistories: BookingStatusHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
