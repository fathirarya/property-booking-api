import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { PropertiesService } from '../properties/properties.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    private readonly propertiesService: PropertiesService,
  ) {}

  async create(propertyId: string, dto: CreateRoomDto): Promise<Room> {
    // Validasi property exist — kalau tidak ada, PropertiesService던지 NotFoundException
    await this.propertiesService.findOne(propertyId);

    const room = this.roomRepo.create({
      ...dto,
      propertyId,
      availableUnit: dto.totalUnit, // awalnya available = total
    });

    return this.roomRepo.save(room);
  }

  async findByProperty(propertyId: string): Promise<Room[]> {
    await this.propertiesService.findOne(propertyId);

    return this.roomRepo.find({
      where: { propertyId },
      order: { createdAt: 'ASC' },
    });
  }
}
