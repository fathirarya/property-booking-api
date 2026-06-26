import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomResponseDto } from './dto/room-response.dto';

@ApiTags('Rooms')
@Controller('properties/:propertyId/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a room to a property' })
  async create(
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateRoomDto,
  ) {
    const room = await this.roomsService.create(propertyId, dto);
    return { data: RoomResponseDto.fromEntity(room), message: 'Room created successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'List all rooms of a property' })
  async findAll(@Param('propertyId') propertyId: string) {
    const rooms = await this.roomsService.findByProperty(propertyId);
    return { data: rooms.map(RoomResponseDto.fromEntity), message: 'Rooms fetched successfully' };
  }
}
