import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoomsModule } from './rooms/rooms.module';
import { PrismaModule } from './prisma/prisma.module';
import { HotelsModule } from './hotels/hotels.module';
import { BookingsModule } from './bookings/bookings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HotelsModule,
    RoomsModule,
    BookingsModule,
    DashboardModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
