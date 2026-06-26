import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyType } from '../../common/enums/property-type.enum';
import { Room } from '../../rooms/entities/room.entity';

@Entity('properties')
export class Property {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Grand Hyatt Jakarta' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ example: 'Jakarta' })
  @Index()
  @Column({ length: 100 })
  city: string;

  @ApiProperty({ example: 'Jl. Sudirman No.1, Jakarta' })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.HOTEL })
  @Index()
  @Column({ type: 'enum', enum: PropertyType })
  type: PropertyType;

  @ApiProperty({ example: 4.5, description: 'Rating 0–5' })
  @Index()
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @OneToMany(() => Room, (room) => room.property)
  rooms: Room[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
