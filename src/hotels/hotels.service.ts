import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(createHotelDto: CreateHotelDto) {
    try {
      // Si tiene éxito, devuelve el objeto de hotel creado
      return await this.prisma.hotel.create({
        data: {
          name: createHotelDto.name,
          description: createHotelDto.description,
          address: createHotelDto.address,
          city: createHotelDto.city,
          country: createHotelDto.country,
          images: createHotelDto.images,
          amenities: createHotelDto.amenities,
          rating: createHotelDto.rating ?? 0,
          totalReviews: createHotelDto.totalReviews ?? 0,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Manejo específico para violación de restricción única
          throw new ConflictException(
            `El nombre de hotel '${createHotelDto.name}' ya existe. Por favor, elige otro.`,
          );
        }
        // Si es otro error conocido de Prisma, podrías querer registrarlo
        // y lanzar un error genérico de servidor o un Bad Request específico.
        console.error('Error conocido de Prisma:', error);
        throw new InternalServerErrorException(
          'Error en la base de datos durante la creación del hotel.',
        );
      } else {
        // Si es cualquier otro error inesperado (no un error conocido de Prisma)
        console.error('Error inesperado durante la creación del hotel:', error);
        throw new InternalServerErrorException(
          'Ha ocurrido un error inesperado al crear el hotel.',
        );
      }
    }
  }

  async findAll(filters?: {
    location?: string;
    guests?: number;
    minRating?: number;
    amenities?: string[];
  }) {
    const where: Prisma.HotelWhereInput = {};

    if (filters?.location) {
      where.OR = [
        { name: { contains: filters.location, mode: 'insensitive' } },
        { city: { contains: filters.location, mode: 'insensitive' } },
        { address: { contains: filters.location, mode: 'insensitive' } },
      ];
    }

    if (filters?.minRating) {
      where.rating = { gte: filters.minRating };
    }

    if (filters?.amenities && filters.amenities.length > 0) {
      where.amenities = { hasSome: filters.amenities };
    }

    if (filters?.guests) {
      where.rooms = {
        some: {
          maxGuests: { gte: filters.guests },
        },
      };
    }

    return this.prisma.hotel.findMany({
      where,
      include: {
        rooms: true,
      },
    });
  }

  async findOne(id: number) {
    const hotelFound = await this.prisma.hotel.findUnique({
      where: {
        // CORREGIDO: Pasar el 'id' como un 'number'
        id: id,
      },
      include: {
        rooms: true,
      },
    });

    if (!hotelFound) {
      throw new NotFoundException(`Hotel con ID ${id} no encontrado`);
    }
    return hotelFound;
  }

  async update(id: number, updateData: Partial<UpdateHotelDto>) {
    const hotelExists = await this.prisma.hotel.findUnique({
      // CORREGIDO: Pasar el 'id' como un 'number'
      where: { id: id },
    });

    if (!hotelExists) {
      throw new NotFoundException(`Hotel con ID ${id} no encontrado`);
    }

    const updatedHotel = await this.prisma.hotel.update({
      where: {
        // CORREGIDO: Pasar el 'id' como un 'number'
        id: id,
      },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return updatedHotel;
  }

  async remove(id: number) {
    try {
      const deletedHotel = await this.prisma.hotel.delete({
        where: {
          // CORREGIDO: Pasar el 'id' como un 'number'
          id: id,
        },
      });
      return deletedHotel;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Hotel con ID ${id} no encontrado`);
      }
      throw error;
    }
  }
}
