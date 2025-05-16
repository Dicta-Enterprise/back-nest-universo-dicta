import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlanetaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  descripcion: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  imagen: string; 

  @IsBoolean()
  @IsOptional()
  estado: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion: Date;
}
