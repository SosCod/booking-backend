import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, PrismaService, ClerkAuthGuard],
})
export class BookingsModule {}
