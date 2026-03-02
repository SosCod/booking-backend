import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoomType } from '@prisma/client';

export class CreateRoomDto {
  @IsInt()
  hotelId: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(RoomType)
  type: RoomType;

  @IsNumber()
  price: number;

  @IsInt()
  maxGuests: number;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
