import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FilterPropertyDto } from './dto/filter-property.dto';
import { PropertyResponseDto } from './dto/property-response.dto';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  async create(@Body() dto: CreatePropertyDto) {
    const property = await this.propertiesService.create(dto);
    return { data: PropertyResponseDto.fromEntity(property), message: 'Property created successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'List properties with filters and cursor pagination (infinite scroll)' })
  async findAll(@Query() filter: FilterPropertyDto) {
    const { properties, hasNextPage, nextCursor } =
      await this.propertiesService.findAll(filter);

    return {
      data: properties.map(PropertyResponseDto.fromEntity),
      message: 'Properties fetched successfully',
      meta: { hasNextPage, nextCursor },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property detail with rooms' })
  async findOne(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    return { data: PropertyResponseDto.fromEntity(property), message: 'Property fetched successfully' };
  }
}
