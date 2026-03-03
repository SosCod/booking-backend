import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, ClerkAuthGuard],
})
export class BookingsModule {}
