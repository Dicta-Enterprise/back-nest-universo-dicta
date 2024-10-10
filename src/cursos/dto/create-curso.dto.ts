import { EstadoGenerico } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  descripcion: string;

  @IsDate()
  @Type(() => Date)
  fechaCreacion: Date;

  @IsDate()
  @Type(() => Date)
  fechaInicio: Date;

  @IsDate()
  @Type(() => Date)
  fechaFinalizacion: Date;

  @IsNumber()
  @Transform(({ value }) => value.trim())
  cantidadAlumnos: number;

  @IsNumber()
  @Transform(({ value }) => value.trim())
  precio: number;

  @IsString()
  profesor: string;

  @IsString()
  estado: EstadoGenerico;

  @IsString()
  @Transform(({ value }) => value.trim())
  imagen: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  video: string;

  @IsNumber()
  @Transform(({ value }) => value.trim())
  duracion: number;

  @IsString()
  @Transform(({ value }) => value.trim())
  categoria: string;

  @IsString()
  idioma: string;

  @IsString()
  planetas: string;
}
