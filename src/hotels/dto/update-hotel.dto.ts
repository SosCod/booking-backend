import { IsNumber, IsOptional, IsString } from 'class-validator';


export class UpdateHotelDto {
    @IsOptional() @IsString() name?: string;
  @IsOptional() @IsNumber() rating?: number;
  // ...otros campos opcionales
}
