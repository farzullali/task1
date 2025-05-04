import { IsNotEmpty, IsNumber, IsString, Min, Max, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(1000000)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  orderReference?: string;
} 