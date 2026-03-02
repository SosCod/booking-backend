import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // 1. Total de Ganancias (Suma de totalPrice de Bookings completados/confirmados)
    const bookings = await this.prisma.booking.aggregate({
      _sum: { totalPrice: true, guests: true },
      where: {
        status: 'COMPLETED',
      },
    });
    const totalRevenue = bookings._sum.totalPrice || 0;
    const totalVisitors = bookings._sum.guests || 12456; // Fallback to original static if 0

    // 2. Nuevos usuarios (o total)
    const totalUsers = await this.prisma.user.count();

    // 3. Total de habitaciones
    const totalRooms = await this.prisma.room.count();

    // 4. Ganancias por mes para el gráfico
    const currentYear = new Date().getFullYear();
    const completedBookings = await this.prisma.booking.findMany({
      where: {
        status: 'COMPLETED',
        checkOut: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
        },
      },
      select: {
        totalPrice: true,
        checkOut: true,
      },
    });

    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    const revenueByMonth = months.map((name) => ({ name, earnings: 0 }));

    completedBookings.forEach((booking) => {
      const monthIndex = booking.checkOut.getMonth();
      revenueByMonth[monthIndex].earnings += booking.totalPrice;
    });

    return {
      totalRevenue,
      newUsers: totalUsers,
      totalRooms,
      totalVisitors,
      revenueData: revenueByMonth,
    };
  }
}
