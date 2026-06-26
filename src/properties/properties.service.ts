import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FilterPropertyDto } from './dto/filter-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  async create(dto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepo.create(dto);
    return this.propertyRepo.save(property);
  }

  async findAll(filter: FilterPropertyDto) {
    const limit = filter.limit ?? 10;

    const needsRoomJoin =
      filter.maxPrice !== undefined ||
      filter.minCapacity !== undefined ||
      (filter.checkInDate && filter.checkOutDate);

    const qb = this.propertyRepo
      .createQueryBuilder('p')
      .orderBy('p.created_at', 'DESC')
      .addOrderBy('p.id', 'DESC');

    // Hanya join rooms kalau ada filter yang butuh data rooms
    if (needsRoomJoin) {
      qb.innerJoin('p.rooms', 'r');
    }

    if (filter.city) {
      qb.andWhere('LOWER(p.city) = LOWER(:city)', { city: filter.city });
    }

    if (filter.type) {
      qb.andWhere('p.type = :type', { type: filter.type });
    }

    if (filter.minRating !== undefined) {
      qb.andWhere('p.rating >= :minRating', { minRating: filter.minRating });
    }

    if (filter.maxPrice !== undefined) {
      qb.andWhere('r.price_per_night <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    if (filter.minCapacity !== undefined) {
      qb.andWhere('r.capacity >= :minCapacity', { minCapacity: filter.minCapacity });
    }

    if (filter.checkInDate && filter.checkOutDate) {
      qb.andWhere(
        `r.available_unit > 0 AND NOT EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.room_id = r.id
            AND b.status NOT IN ('CANCELLED', 'EXPIRED')
            AND b.check_in_date < :checkOut
            AND b.check_out_date > :checkIn
        )`,
        { checkIn: filter.checkInDate, checkOut: filter.checkOutDate },
      );
    }

    if (filter.cursor) {
      const decoded = Buffer.from(filter.cursor, 'base64').toString('utf8');
      const [ts, cursorId] = decoded.split('__');
      const cursorDate = new Date(parseInt(ts));
      qb.andWhere(
        '(p.created_at < :cursorDate OR (p.created_at = :cursorDate AND p.id < :cursorId))',
        { cursorDate, cursorId },
      );
    }

    // distinct untuk hindari duplikasi saat ada join
    if (needsRoomJoin) {
      qb.distinct(true);
    }

    const properties = await qb.limit(limit + 1).getMany();

    const hasNextPage = properties.length > limit;
    if (hasNextPage) properties.pop();

    const nextCursor =
      hasNextPage && properties.length > 0
        ? Buffer.from(
            `${properties[properties.length - 1].createdAt.getTime()}__${properties[properties.length - 1].id}`,
          ).toString('base64')
        : null;

    return { properties, hasNextPage, nextCursor };
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepo.findOne({
      where: { id },
      relations: ['rooms'],
    });

    if (!property) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }

    return property;
  }
}
