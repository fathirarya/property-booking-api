import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new coupon' })
  async create(@Body() dto: CreateCouponDto) {
    const coupon = await this.couponsService.create(dto);
    return { data: coupon, message: 'Coupon created successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'List all coupons' })
  async findAll() {
    const coupons = await this.couponsService.findAll();
    return { data: coupons, message: 'Coupons fetched successfully' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon detail by id' })
  async findOne(@Param('id') id: string) {
    const coupon = await this.couponsService.findOne(id);
    return { data: coupon, message: 'Coupon fetched successfully' };
  }
}
