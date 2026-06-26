import { ApiProperty } from '@nestjs/swagger';
import { Room } from '../entities/room.entity';

export class RoomResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  propertyId: string;

  @ApiProperty({ example: 'Deluxe King Room' })
  name: string;

  @ApiProperty({ example: 2 })
  capacity: number;

  @ApiProperty({ example: 500000 })
  pricePerNight: number;

  @ApiProperty({ example: 10 })
  totalUnit: number;

  @ApiProperty({ example: 8 })
  availableUnit: number;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(room: Room): RoomResponseDto {
    const dto = new RoomResponseDto();
    dto.id = room.id;
    dto.propertyId = room.propertyId;
    dto.name = room.name;
    dto.capacity = room.capacity;
    dto.pricePerNight = Number(room.pricePerNight);
    dto.totalUnit = room.totalUnit;
    dto.availableUnit = room.availableUnit;
    dto.createdAt = room.createdAt;
    return dto;
  }
}
