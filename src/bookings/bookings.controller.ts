import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('occupancy/:roomId')
  getOccupancy(@Param('roomId') roomId: string) {
    return this.bookingsService.getOccupancy(+roomId);
  }

  @Post()
  @UseGuards(ClerkAuthGuard)
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.clerkId, createBookingDto);
  }

  @Get()
  @UseGuards(ClerkAuthGuard)
  findAll(@Request() req) {
    // Si es admin puede ver todo, si no, solo lo suyo
    if (req.user.role === 'admin') {
      return this.bookingsService.findAll();
    }
    return this.bookingsService.findByUser(req.user.clerkId);
  }

  @Get('my-bookings')
  @UseGuards(ClerkAuthGuard)
  findMyBookings(@Request() req) {
    return this.bookingsService.findByUser(req.user.clerkId);
  }

  @Get(':id')
  @UseGuards(ClerkAuthGuard)
  findOne(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'admin') {
      throw new BadRequestException(
        'No tienes permisos para realizar esta acción',
      );
    }
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id/status')
  @UseGuards(ClerkAuthGuard)
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    if (req.user.role !== 'admin') {
      throw new BadRequestException(
        'No tienes permisos para realizar esta acción',
      );
    }
    return this.bookingsService.updateStatus(+id, status);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  remove(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'admin') {
      throw new BadRequestException(
        'No tienes permisos para realizar esta acción',
      );
    }
    return this.bookingsService.delete(+id);
  }
}
