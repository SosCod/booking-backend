import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  roomId: number;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsInt()
  guests: number;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}
