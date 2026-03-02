import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { createClerkClient } from '@clerk/backend';
@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(clerkId: string, createBookingDto: CreateBookingDto) {
    const { roomId, checkIn, checkOut, guests, specialRequests } =
      createBookingDto;

    // 1. Validar fechas
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (start >= end) {
      throw new BadRequestException(
        'La fecha de salida debe ser posterior a la de entrada',
      );
    }

    // 2. Obtener la habitación y validar existencia
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new NotFoundException('Habitación no encontrada');
    }

    // 3. Obtener o crear el usuario local basado en ClerkId
    // Nota: En una app real, esto podría hacerse vía Webhooks de Clerk
    let user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      try {
        // Obtenemos los datos reales del usuario desde Clerk
        const clerkClient = createClerkClient({
          secretKey: process.env.CLERK_SECRET_KEY,
        });
        const clerkUser = await clerkClient.users.getUser(clerkId);

        let primaryEmail = clerkUser.emailAddresses.find(
          (e) => e.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress;
        if (!primaryEmail && clerkUser.emailAddresses.length > 0)
          primaryEmail = clerkUser.emailAddresses[0].emailAddress;

        const name =
          `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
          'Cliente';

        user = await this.prisma.user.create({
          data: {
            clerkId,
            email: primaryEmail || `${clerkId}@temporary.clerk`,
            name: name || 'Clerk User',
          },
        });
      } catch (error) {
        // Fallback si la conexión de red falla
        user = await this.prisma.user.create({
          data: {
            clerkId,
            email: `${clerkId}@temporary.clerk`,
            name: 'Clerk User',
          },
        });
      }
    }

    // 4. Verificar disponibilidad
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        roomId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            checkIn: { lte: end },
            checkOut: { gte: start },
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException(
        'La habitación no está disponible para las fechas seleccionadas',
      );
    }

    // 5. Calcular precio total
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = nights * room.price;

    // 6. Crear la reserva
    return this.prisma.booking.create({
      data: {
        userId: user.id,
        roomId,
        checkIn: start,
        checkOut: end,
        guests,
        totalPrice,
        specialRequests,
        status: 'PENDING',
      },
      include: {
        room: true,
      },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: true,
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });
  }

  async findByUser(clerkId: string) {
    const user = await this.prisma.user.findUnique({ where: { clerkId } });
    if (!user) return [];

    return this.prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async updateStatus(id: number, status: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: status as any },
      include: {
        user: true,
        room: true,
      },
    });
  }

  async delete(id: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return this.prisma.booking.delete({ where: { id } });
  }

  async getOccupancy(roomId: number) {
    return this.prisma.booking.findMany({
      where: {
        roomId,
        status: { not: 'CANCELLED' },
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
    });
  }
}
