import { EstadoGenerico } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
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
  @IsEnum(EstadoGenerico, {
    message:
      'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
  })
  estado: EstadoGenerico;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion: Date;


  @IsOptional()
  @IsString()
  imagenUrl: string;
}
