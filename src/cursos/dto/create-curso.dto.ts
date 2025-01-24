import { EstadoGenerico } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { 
  IsDate, IsEnum, IsMongoId, IsNumber, IsOptional, IsString 
} from 'class-validator';

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
  cantidadAlumnos: number;

  @IsNumber()
  precio: number;

  @IsString()
  @IsEnum(EstadoGenerico, {
    message:
      'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
  })
  estado: EstadoGenerico;

  @IsString()
  @Transform(({ value }) => value.trim())
  imagen: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  video: string;

  @IsNumber()
  duracion: number;

  @IsString()
  @IsMongoId()
  @Transform(({ value }) => value.trim())
  categoriaId: string;
  
  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => value.trim())
  profesorId: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  idiomaId: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => value.trim())
  planetaId: string;
}
