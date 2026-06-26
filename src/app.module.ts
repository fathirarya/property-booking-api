import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './common/config/database.config';
import { PropertiesModule } from './properties/properties.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { CouponsModule } from './coupons/coupons.module';
import { PaymentsModule } from './payments/payments.module';
import { DatabaseSeeder } from './database/database.seeder';
import { Coupon } from './coupons/entities/coupon.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),

    TypeOrmModule.forFeature([Coupon]),

    PropertiesModule,
    RoomsModule,
    BookingsModule,
    CouponsModule,
    PaymentsModule,
  ],
  providers: [DatabaseSeeder],
})
export class AppModule {}
