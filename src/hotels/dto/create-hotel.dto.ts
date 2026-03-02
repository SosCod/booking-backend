import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer'; // Needed if you transform types
export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  // Images: When you upload files, the controller processes them and passes filenames
  // So, this should likely be string[] in your DTO when it reaches the service
  @IsArray()
  @IsString({ each: true })
  @IsOptional() // If images are not strictly required for DTO validation
  images?: string[];

  // Amenities: Your frontend sends a comma-separated string, so backend needs to handle this.
  // Option 1: Expect a single string here, then split in service/controller.
  // @IsString()
  // amenities: string;
  // Option 2: If your DTO (after transformation) expects string[], handle splitting in a pipe.
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item)
      : value,
  )
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
  
  @IsNumber()
  @IsOptional()
  @Type(() => Number) // Use @Type from class-transformer if you're sending numbers as strings
  rating?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalReviews?: number;
}
