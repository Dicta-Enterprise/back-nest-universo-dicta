import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
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
  @IsBoolean()
  estado: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion: Date;

  @IsOptional()
  @IsNumber()
  x?: number;

  @IsOptional()
  @IsNumber()
  y?: number;

  @IsOptional()
  @IsNumber()
  z?: number;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  modelo?: string;
}
