import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  async create(@Body() dto: CreateBookingDto) {
    const booking = await this.bookingsService.create(dto);
    return { data: BookingResponseDto.fromEntity(booking), message: 'Booking created successfully' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking detail with room, property, coupon, and status history' })
  async findOne(@Param('id') id: string) {
    const booking = await this.bookingsService.findOne(id);
    return { data: BookingResponseDto.fromEntity(booking), message: 'Booking fetched successfully' };
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Pay a booking (PENDING → PAID)' })
  async pay(@Param('id') id: string) {
    const booking = await this.bookingsService.pay(id);
    return { data: BookingResponseDto.fromEntity(booking), message: 'Booking paid successfully' };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking (PENDING → CANCELLED)' })
  async cancel(@Param('id') id: string) {
    const booking = await this.bookingsService.cancel(id);
    return { data: BookingResponseDto.fromEntity(booking), message: 'Booking cancelled successfully' };
  }
}
