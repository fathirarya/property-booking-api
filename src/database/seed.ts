import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { Room } from '../rooms/entities/room.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingStatusHistory } from '../bookings/entities/booking-status-history.entity';
import { Payment } from '../payments/entities/payment.entity';
import { PropertyType } from '../common/enums/property-type.enum';
import { CouponType } from '../common/enums/coupon-type.enum';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'property_booking',
  entities: [Property, Room, Coupon, Booking, BookingStatusHistory, Payment],
  synchronize: false,
});

const properties = [
  { name: 'Grand Hyatt Jakarta', city: 'Jakarta', address: 'Jl. Sudirman No.1, Jakarta Pusat', type: PropertyType.HOTEL, rating: 4.8 },
  { name: 'Ayana Midplaza Jakarta', city: 'Jakarta', address: 'Jl. Jend. Sudirman Kav.10-11, Jakarta', type: PropertyType.HOTEL, rating: 4.7 },
  { name: 'Hotel Indonesia Kempinski', city: 'Jakarta', address: 'Jl. M.H. Thamrin No.1, Jakarta', type: PropertyType.HOTEL, rating: 4.6 },
  { name: 'Apartemen Taman Anggrek', city: 'Jakarta', address: 'Jl. Let. Jend. S. Parman, Jakarta Barat', type: PropertyType.APARTMENT, rating: 4.2 },
  { name: 'The Breeze Guest House', city: 'Jakarta', address: 'BSD City, Tangerang Selatan', type: PropertyType.GUEST_HOUSE, rating: 3.9 },

  { name: 'The Royal Pita Maha', city: 'Bali', address: 'Jl. Kedewatan, Ubud, Bali', type: PropertyType.VILLA, rating: 4.9 },
  { name: 'Alaya Resort Ubud', city: 'Bali', address: 'Jl. Hanoman, Ubud, Bali', type: PropertyType.HOTEL, rating: 4.7 },
  { name: 'Villa Canggu Indah', city: 'Bali', address: 'Jl. Batu Bolong, Canggu, Bali', type: PropertyType.VILLA, rating: 4.5 },
  { name: 'Kuta Beach Hotel', city: 'Bali', address: 'Jl. Pantai Kuta, Kuta, Bali', type: PropertyType.HOTEL, rating: 3.8 },
  { name: 'Seminyak Sunset Villa', city: 'Bali', address: 'Jl. Kayu Aya, Seminyak, Bali', type: PropertyType.VILLA, rating: 4.6 },

  { name: 'Tentrem Hotel Yogyakarta', city: 'Yogyakarta', address: 'Jl. A.M. Sangaji No.72A, Yogyakarta', type: PropertyType.HOTEL, rating: 4.8 },
  { name: 'Phoenix Hotel Yogyakarta', city: 'Yogyakarta', address: 'Jl. Jend. Sudirman No.9, Yogyakarta', type: PropertyType.HOTEL, rating: 4.3 },
  { name: 'Prambanan Guest House', city: 'Yogyakarta', address: 'Jl. Prambanan, Sleman, Yogyakarta', type: PropertyType.GUEST_HOUSE, rating: 3.7 },
  { name: 'Malioboro Apartment', city: 'Yogyakarta', address: 'Jl. Malioboro No.52, Yogyakarta', type: PropertyType.APARTMENT, rating: 4.1 },

  { name: 'JW Marriott Surabaya', city: 'Surabaya', address: 'Jl. Embong Malang No.85-89, Surabaya', type: PropertyType.HOTEL, rating: 4.7 },
  { name: 'Shangri-La Surabaya', city: 'Surabaya', address: 'Jl. Mayjend Yono Soewoyo, Surabaya', type: PropertyType.HOTEL, rating: 4.8 },
  { name: 'Gubeng Apartment', city: 'Surabaya', address: 'Jl. Gubeng Raya No.12, Surabaya', type: PropertyType.APARTMENT, rating: 4.0 },

  { name: 'Padma Hotel Bandung', city: 'Bandung', address: 'Jl. Ranca Bentang No.56-58, Bandung', type: PropertyType.HOTEL, rating: 4.6 },
  { name: 'Dago Villa Bandung', city: 'Bandung', address: 'Jl. Ir. H. Juanda No.100, Dago, Bandung', type: PropertyType.VILLA, rating: 4.4 },
  { name: 'Lembang Guest House', city: 'Bandung', address: 'Jl. Grand Hotel No.33, Lembang, Bandung', type: PropertyType.GUEST_HOUSE, rating: 4.0 },
];

const hotelRoomTemplates = [
  { name: 'Standard Room', capacity: 2, pricePerNight: 350000, totalUnit: 20 },
  { name: 'Superior Room', capacity: 2, pricePerNight: 500000, totalUnit: 15 },
  { name: 'Deluxe Room', capacity: 2, pricePerNight: 750000, totalUnit: 10 },
  { name: 'Junior Suite', capacity: 3, pricePerNight: 1200000, totalUnit: 5 },
  { name: 'Executive Suite', capacity: 4, pricePerNight: 2000000, totalUnit: 3 },
];

const villaRoomTemplates = [
  { name: '1-Bedroom Villa', capacity: 2, pricePerNight: 1500000, totalUnit: 3 },
  { name: '2-Bedroom Villa', capacity: 4, pricePerNight: 2500000, totalUnit: 2 },
  { name: '3-Bedroom Pool Villa', capacity: 6, pricePerNight: 4000000, totalUnit: 1 },
];

const apartmentRoomTemplates = [
  { name: 'Studio', capacity: 2, pricePerNight: 400000, totalUnit: 10 },
  { name: '1-Bedroom Apartment', capacity: 2, pricePerNight: 600000, totalUnit: 8 },
  { name: '2-Bedroom Apartment', capacity: 4, pricePerNight: 900000, totalUnit: 5 },
];

const guestHouseRoomTemplates = [
  { name: 'Standard Room', capacity: 2, pricePerNight: 200000, totalUnit: 6 },
  { name: 'Family Room', capacity: 4, pricePerNight: 350000, totalUnit: 3 },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const propertyRepo = AppDataSource.getRepository(Property);
  const roomRepo = AppDataSource.getRepository(Room);
  const couponRepo = AppDataSource.getRepository(Coupon);

  // ── Coupons ──────────────────────────────────────────────
  const coupons = [
    { code: 'NEWUSER10', type: CouponType.PERCENTAGE, discountValue: 10, minTransaction: 500000, maxDiscount: 100000 },
    { code: 'STAYCATION50', type: CouponType.FIXED, discountValue: 50000, minTransaction: 300000, maxDiscount: null },
  ];

  for (const c of coupons) {
    const exists = await couponRepo.findOne({ where: { code: c.code } });
    if (!exists) {
      await couponRepo.save(couponRepo.create(c));
      console.log(`[Coupon] ${c.code} inserted`);
    }
  }

  // ── Properties & Rooms ────────────────────────────────────
  let insertedCount = 0;

  for (const p of properties) {
    const exists = await propertyRepo.findOne({ where: { name: p.name } });
    if (exists) {
      console.log(`[Property] ${p.name} already exists, skip`);
      continue;
    }

    const property = await propertyRepo.save(propertyRepo.create(p));
    insertedCount++;
    console.log(`[Property] ${p.name} inserted`);

    const templates = {
      [PropertyType.HOTEL]: hotelRoomTemplates,
      [PropertyType.VILLA]: villaRoomTemplates,
      [PropertyType.APARTMENT]: apartmentRoomTemplates,
      [PropertyType.GUEST_HOUSE]: guestHouseRoomTemplates,
    }[p.type];

    const count = Math.floor(Math.random() * 2) + 2;
    const selectedRooms = templates.slice(0, Math.min(count, templates.length));
    for (const r of selectedRooms) {
      await roomRepo.save(
        roomRepo.create({ ...r, propertyId: property.id, availableUnit: r.totalUnit }),
      );
    }
    console.log(`  └─ ${selectedRooms.length} rooms inserted`);
  }

  console.log('\nSeeding completed!');
  console.log(`Properties inserted : ${insertedCount}`);
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
