import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsOptional()
  descripcion: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true) // 👈 convierte string a boolean
  @IsBoolean()
  estado: boolean;

  @IsOptional()
  @Type(() => Number) // 👈 convierte a número
  @IsNumber()
  x?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  y?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  z?: number;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  modelo?: string;
}
