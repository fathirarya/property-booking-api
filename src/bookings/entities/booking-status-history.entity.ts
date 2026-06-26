import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { Booking } from './booking.entity';

@Entity('booking_status_histories')
export class BookingStatusHistory {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'booking_id' })
  bookingId: string;

  @ApiProperty({ enum: BookingStatus, nullable: true })
  @Column({ name: 'from_status', type: 'enum', enum: BookingStatus, nullable: true })
  fromStatus: BookingStatus | null;

  @ApiProperty({ enum: BookingStatus })
  @Column({ name: 'to_status', type: 'enum', enum: BookingStatus })
  toStatus: BookingStatus;

  @ManyToOne(() => Booking, (booking) => booking.statusHistories)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;
}
