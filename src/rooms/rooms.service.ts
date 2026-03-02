import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      return await this.prisma.room.create({
        data: {
          hotelId: createRoomDto.hotelId,
          name: createRoomDto.name,
          description: createRoomDto.description,
          type: createRoomDto.type,
          price: createRoomDto.price,
          maxGuests: createRoomDto.maxGuests,
          images: createRoomDto.images,
          amenities: createRoomDto.amenities,
          isAvailable: createRoomDto.isAvailable ?? true,
        },
      });
    } catch (error) {
      console.error('Error creating room:', error);
      throw new InternalServerErrorException('Error al crear la habitación');
    }
  }

  async findAll() {
    return this.prisma.room.findMany({
      include: {
        hotel: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        hotel: true,
      },
    });

    if (!room) {
      throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
    }

    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    try {
      const room = await this.prisma.room.findUnique({ where: { id } });
      if (!room) {
        throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
      }

      return await this.prisma.room.update({
        where: { id },
        data: {
          ...updateRoomDto,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error updating room:', error);
      throw new InternalServerErrorException(
        'Error al actualizar la habitación',
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.room.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
      }
      throw error;
    }
  }
}
