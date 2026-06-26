import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { CouponType } from '../../common/enums/coupon-type.enum';
import { Booking } from '../entities/booking.entity';

export class CouponInBookingDto {
  @ApiProperty({ example: 'NEWUSER10' })
  code: string;

  @ApiProperty({ enum: CouponType })
  type: CouponType;

  @ApiProperty({ example: 10 })
  discountValue: number;
}

export class RoomInBookingDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'Deluxe King Room' })
  name: string;

  @ApiProperty({ example: 2 })
  capacity: number;

  @ApiProperty({ example: 500000 })
  pricePerNight: number;

  @ApiPropertyOptional()
  property?: {
    id: string;
    name: string;
    city: string;
    type: string;
  };
}

export class StatusHistoryDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ enum: BookingStatus, nullable: true })
  fromStatus: BookingStatus | null;

  @ApiProperty({ enum: BookingStatus })
  toStatus: BookingStatus;

  @ApiProperty()
  changedAt: Date;
}

export class BookingResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'BK-ABC12345' })
  bookingCode: string;

  @ApiProperty({ example: 'John Doe' })
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  customerEmail: string;

  @ApiProperty({ example: 'uuid-v4' })
  roomId: string;

  @ApiPropertyOptional({ type: RoomInBookingDto })
  room?: RoomInBookingDto;

  @ApiProperty({ example: '2026-07-01' })
  checkInDate: string;

  @ApiProperty({ example: '2026-07-04' })
  checkOutDate: string;

  @ApiProperty({ example: 3 })
  totalNights: number;

  @ApiProperty({ example: 1500000 })
  subtotal: number;

  @ApiProperty({ example: 150000 })
  autoDiscountAmount: number;

  @ApiProperty({ example: 100000 })
  couponDiscountAmount: number;

  @ApiProperty({ example: 1250000 })
  finalPrice: number;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiPropertyOptional({ type: CouponInBookingDto })
  coupon?: CouponInBookingDto | null;

  @ApiPropertyOptional({ type: [StatusHistoryDto] })
  statusHistories?: StatusHistoryDto[];

  @ApiProperty()
  createdAt: Date;

  static fromEntity(booking: Booking): BookingResponseDto {
    const dto = new BookingResponseDto();
    dto.id = booking.id;
    dto.bookingCode = booking.bookingCode;
    dto.customerName = booking.customerName;
    dto.customerEmail = booking.customerEmail;
    dto.roomId = booking.roomId;
    dto.checkInDate = booking.checkInDate;
    dto.checkOutDate = booking.checkOutDate;
    dto.totalNights = booking.totalNights;
    dto.subtotal = Number(booking.subtotal);
    dto.autoDiscountAmount = Number(booking.autoDiscountAmount);
    dto.couponDiscountAmount = Number(booking.couponDiscountAmount);
    dto.finalPrice = Number(booking.finalPrice);
    dto.status = booking.status;
    dto.createdAt = booking.createdAt;

    if (booking.room) {
      dto.room = {
        id: booking.room.id,
        name: booking.room.name,
        capacity: booking.room.capacity,
        pricePerNight: Number(booking.room.pricePerNight),
        ...(booking.room.property && {
          property: {
            id: booking.room.property.id,
            name: booking.room.property.name,
            city: booking.room.property.city,
            type: booking.room.property.type,
          },
        }),
      };
    }

    if (booking.coupon) {
      dto.coupon = {
        code: booking.coupon.code,
        type: booking.coupon.type,
        discountValue: Number(booking.coupon.discountValue),
      };
    }

    if (booking.statusHistories) {
      dto.statusHistories = booking.statusHistories.map((h) => ({
        id: h.id,
        fromStatus: h.fromStatus,
        toStatus: h.toStatus,
        changedAt: h.changedAt,
      }));
    }

    return dto;
  }
}
