import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  async create(@Body() createHotelDto: CreateHotelDto) {
    console.log('Datos recibidos:', createHotelDto);
    return this.hotelsService.create(createHotelDto);
  }

  @Get()
  findAll(
    @Query('location') location?: string,
    @Query('guests') guests?: string,
    @Query('minRating') minRating?: string,
    @Query('amenities') amenities?: string | string[],
  ) {
    const amenitiesList = Array.isArray(amenities)
      ? amenities
      : amenities
        ? [amenities]
        : undefined;

    return this.hotelsService.findAll({
      location,
      guests: guests ? +guests : undefined,
      minRating: minRating ? +minRating : undefined,
      amenities: amenitiesList,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.hotelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(+id, updateHotelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.hotelsService.remove(+id);
  }
}
