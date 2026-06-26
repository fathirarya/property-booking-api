import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '../../common/enums/property-type.enum';
import { Property } from '../entities/property.entity';
import { RoomResponseDto } from '../../rooms/dto/room-response.dto';

export class PropertyResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'Grand Hyatt Jakarta' })
  name: string;

  @ApiProperty({ example: 'Jakarta' })
  city: string;

  @ApiProperty({ example: 'Jl. Sudirman No.1, Jakarta' })
  address: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.HOTEL })
  type: PropertyType;

  @ApiProperty({ example: 4.8 })
  rating: number;

  @ApiPropertyOptional({ type: [RoomResponseDto] })
  rooms?: RoomResponseDto[];

  @ApiProperty()
  createdAt: Date;

  static fromEntity(property: Property): PropertyResponseDto {
    const dto = new PropertyResponseDto();
    dto.id = property.id;
    dto.name = property.name;
    dto.city = property.city;
    dto.address = property.address;
    dto.type = property.type;
    dto.rating = Number(property.rating);
    dto.createdAt = property.createdAt;

    if (property.rooms) {
      dto.rooms = property.rooms.map(RoomResponseDto.fromEntity);
    }

    return dto;
  }
}
