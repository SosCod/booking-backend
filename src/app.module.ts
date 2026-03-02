import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { PrismaService } from './prisma/prisma.service';
import { HotelsModule } from './hotels/hotels.module';
import { BookingsModule } from './bookings/bookings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [HotelsModule, RoomsModule, BookingsModule, DashboardModule, UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
