import { EstadoGenerico } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { 
  IsDate, IsDefined, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, 
  IsUrl, 
} from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  descripcion: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  fechaInicio: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  fechaFinalizacion: Date;

  @IsNumber()
  @IsDefined()
  @IsPositive()
  cantidadAlumnos: number;

  @IsNumber()
  @IsPositive()
  @IsDefined()
  precio: number;

  @IsString()
  @IsEnum(EstadoGenerico, {
    message:
      'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
  })
  estado: EstadoGenerico;

  @IsUrl()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  imagen: string;

  @IsUrl()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  video: string;

  @IsNumber()
  @IsPositive()
  @IsDefined()
  duracion: number;

  @IsString()
  @IsMongoId()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  categoriaId: string;
  
  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  profesorId: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  idiomaId: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  planetaId: string;
}
