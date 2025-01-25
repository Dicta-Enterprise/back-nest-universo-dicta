import { EstadoGenerico } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { 
  IsDate, IsDefined, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, 
  IsUrl, 
} from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
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
  @Transform(({ value }) => value.trim())
  imagen: string;

  @IsUrl()
  @Transform(({ value }) => value.trim())
  video: string;

  @IsNumber()
  @IsPositive()
  @IsDefined()
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
  idiomaId: string; // Enum 

  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => value.trim())
  planetaId: string;
}
