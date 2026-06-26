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
import { Property } from '../../properties/entities/property.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('rooms')
export class Room {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid-v4', description: 'Property ID' })
  @Index()
  @Column({ name: 'property_id' })
  propertyId: string;

  @ApiProperty({ example: 'Deluxe King Room' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ example: 2, description: 'Max number of guests' })
  @Column({ type: 'int' })
  capacity: number;

  @ApiProperty({ example: 500000, description: 'Price per night in IDR' })
  @Column({ name: 'price_per_night', type: 'decimal', precision: 15, scale: 2 })
  pricePerNight: number;

  @ApiProperty({ example: 10, description: 'Total available units' })
  @Column({ name: 'total_unit', type: 'int' })
  totalUnit: number;

  @ApiProperty({ example: 8, description: 'Currently available units' })
  @Index()
  @Column({ name: 'available_unit', type: 'int' })
  availableUnit: number;

  @ManyToOne(() => Property, (property) => property.rooms)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
