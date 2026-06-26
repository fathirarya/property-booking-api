import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Booking } from './entities/booking.entity';
import { BookingStatusHistory } from './entities/booking-status-history.entity';
import { Room } from '../rooms/entities/room.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Payment } from '../payments/entities/payment.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { CouponType } from '../common/enums/coupon-type.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(BookingStatusHistory)
    private readonly historyRepo: Repository<BookingStatusHistory>,

    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,

    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    // 1. Validasi room exist
    const room = await this.roomRepo.findOne({
      where: { id: dto.roomId },
      relations: ['property'],
    });
    if (!room) throw new NotFoundException('Room not found');

    // 2. Validasi unit tersedia
    if (room.availableUnit < 1) {
      throw new BadRequestException('No available units for this room');
    }

    // 3. Validasi tanggal
    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);
    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    // 4. Hitung total malam
    const totalNights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );

    // 5. Hitung subtotal
    const subtotal = Number(room.pricePerNight) * totalNights;

    // 6. Auto discount 10% jika >= 3 malam
    const autoDiscountAmount = totalNights >= 3 ? subtotal * 0.1 : 0;

    // 7. Hitung coupon discount
    let couponDiscountAmount = 0;
    let couponId: string | null = null;

    if (dto.couponCode) {
      const coupon = await this.couponRepo.findOne({
        where: { code: dto.couponCode },
      });

      if (!coupon) {
        throw new NotFoundException(`Coupon code '${dto.couponCode}' is not valid`);
      }

      if (subtotal < Number(coupon.minTransaction)) {
        throw new BadRequestException(
          `Minimum transaction for this coupon is Rp ${coupon.minTransaction.toLocaleString()}`,
        );
      }

      if (coupon.type === CouponType.PERCENTAGE) {
        const rawDiscount = subtotal * (Number(coupon.discountValue) / 100);
        couponDiscountAmount = coupon.maxDiscount
          ? Math.min(rawDiscount, Number(coupon.maxDiscount))
          : rawDiscount;
      } else {
        couponDiscountAmount = Number(coupon.discountValue);
      }

      couponId = coupon.id;
    }

    // 8. Final price
    const finalPrice = subtotal - autoDiscountAmount - couponDiscountAmount;

    // 9. Generate booking code unik
    const bookingCode = 'BK-' + uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();

    // 10. Kurangi available unit
    await this.roomRepo.decrement({ id: room.id }, 'availableUnit', 1);

    // 11. Simpan booking
    const booking = await this.bookingRepo.save(
      this.bookingRepo.create({
        bookingCode,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        roomId: dto.roomId,
        checkInDate: dto.checkInDate,
        checkOutDate: dto.checkOutDate,
        totalNights,
        subtotal,
        autoDiscountAmount,
        couponDiscountAmount,
        finalPrice,
        status: BookingStatus.PENDING,
        couponId,
      }),
    );

    // Catat status history
    await this.saveHistory(booking.id, null, BookingStatus.PENDING);

    return booking;
  }

  async pay(id: string): Promise<Booking> {
    const booking = await this.findOneOrFail(id);

    await this.expireIfStale(booking);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Cannot pay booking with status '${booking.status}'. Only PENDING bookings can be paid`,
      );
    }

    const prevStatus = booking.status;
    booking.status = BookingStatus.PAID;
    const saved = await this.bookingRepo.save(booking);

    // Simpan record pembayaran
    await this.paymentRepo.save(
      this.paymentRepo.create({
        bookingId: id,
        amount: booking.finalPrice,
        paidAt: new Date(),
      }),
    );

    await this.saveHistory(id, prevStatus, BookingStatus.PAID);

    return saved;
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.findOneOrFail(id);

    await this.expireIfStale(booking);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Cannot cancel booking with status '${booking.status}'. Only PENDING bookings can be cancelled`,
      );
    }

    const prevStatus = booking.status;
    booking.status = BookingStatus.CANCELLED;
    const saved = await this.bookingRepo.save(booking);

    // Kembalikan unit yang tadi dikurangi saat booking dibuat
    await this.roomRepo.increment({ id: booking.roomId }, 'availableUnit', 1);

    await this.saveHistory(id, prevStatus, BookingStatus.CANCELLED);

    return saved;
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['room', 'room.property', 'coupon', 'statusHistories'],
    });
    if (!booking) throw new NotFoundException(`Booking with id ${id} not found`);
    return booking;
  }

  private async findOneOrFail(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException(`Booking with id ${id} not found`);
    return booking;
  }

  private async expireIfStale(booking: Booking): Promise<void> {
    if (booking.status !== BookingStatus.PENDING) return;

    const EXPIRY_MINUTES = 15;
    const expiredAt = new Date(booking.createdAt.getTime() + EXPIRY_MINUTES * 60 * 1000);

    if (new Date() < expiredAt) return;

    booking.status = BookingStatus.EXPIRED;
    await this.bookingRepo.save(booking);
    await this.roomRepo.increment({ id: booking.roomId }, 'availableUnit', 1);
    await this.saveHistory(booking.id, BookingStatus.PENDING, BookingStatus.EXPIRED);

    throw new BadRequestException(
      `Booking has expired. PENDING bookings must be paid within ${EXPIRY_MINUTES} minutes`,
    );
  }

  private async saveHistory(
    bookingId: string,
    fromStatus: BookingStatus | null,
    toStatus: BookingStatus,
  ) {
    await this.historyRepo.save(
      this.historyRepo.create({ bookingId, fromStatus, toStatus }),
    );
  }
}
