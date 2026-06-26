import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../coupons/entities/coupon.entity';
import { CouponType } from '../common/enums/coupon-type.enum';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  // OnApplicationBootstrap = jalan otomatis sekali setelah semua module siap
  async onApplicationBootstrap() {
    await this.seedCoupons();
  }

  private async seedCoupons() {
    const coupons = [
      {
        code: 'NEWUSER10',
        type: CouponType.PERCENTAGE,
        discountValue: 10,
        minTransaction: 500000,
        maxDiscount: 100000,
      },
      {
        code: 'STAYCATION50',
        type: CouponType.FIXED,
        discountValue: 50000,
        minTransaction: 300000,
        maxDiscount: null,
      },
    ];

    for (const coupon of coupons) {
      const exists = await this.couponRepo.findOne({ where: { code: coupon.code } });
      if (!exists) {
        await this.couponRepo.save(this.couponRepo.create(coupon));
        console.log(`[Seeder] Coupon ${coupon.code} inserted`);
      }
    }
  }
}
