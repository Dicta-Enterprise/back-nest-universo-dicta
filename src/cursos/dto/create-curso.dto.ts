import { ApiProperty } from '@nestjs/swagger';
import { EstadoGenerico } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { 
  IsDate, IsDefined, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, 
  IsUrl,
  MinDate,
} from 'class-validator';
import { IsFechaValida } from '../decorator/IsFechaValida.decorator';

export class CreateCursoDto {

  @ApiProperty({ example: 'Curso para ...' })
  @IsString({ message: 'El nombre del curso debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del curso no puede estar vacío' })
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  nombre: string;

  @ApiProperty({example: 'Un curso diseñado para ...'})
  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  descripcion: string;

  @ApiProperty({example: new Date()})
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de inicio no puede estar vacía' })
  @Type(() => Date)
  @MinDate(new Date(), { message: 'La fecha de inicio No debe ser posterior a la fecha actual' })
  fechaInicio: Date;

  @ApiProperty({example: new Date()})
  @IsDate({ message: 'La fecha de finalización debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de finalización no puede estar vacía' })
  @Type(() => Date)
  @MinDate(new Date(),{ message: 'La fecha de finalización No debe ser posterior a la fecha actual' })
  @IsFechaValida({ message: 'La fecha de finalización debe ser posterior a la fecha de inicio' })
  fechaFinalizacion: Date;

  @ApiProperty({example: 20})
  @IsNumber({}, { message: 'La cantidad de alumnos debe ser un número' })
  @IsDefined({ message: 'La cantidad de alumnos es requerida' })
  @IsPositive({ message: 'La cantidad de alumnos debe ser un número positivo' })
  cantidadAlumnos: number;

  @ApiProperty({example: 1000})
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  @IsDefined({ message: 'El precio es requerido' })
  precio: number;

  @ApiProperty({example: 'ACTIVO', enum: EstadoGenerico})
  @IsString({ message: 'El estado debe ser un texto' })
  @IsEnum(EstadoGenerico, {
    message:
      'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
  })
  estado: EstadoGenerico;

  @ApiProperty({example: 'https://example.com/curso-imagen2.jpg'})
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  imagen: string;

  @ApiProperty({example: 'https://example.com/curso-video.mp4'})
  @IsUrl({}, { message: 'La URL del video debe ser válida' })
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  video: string;

  @ApiProperty({example: 40})
  @IsNumber({}, { message: 'La duración debe ser un número' })
  @IsPositive({ message: 'La duración debe ser un número positivo' })
  @IsDefined({ message: 'La duración es requerida' })
  duracion: number;

  @ApiProperty({example: '670aa5b834951486809e8fa1'})
  @IsString()
  @IsMongoId()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  categoriaId: string;
  
  @ApiProperty({example: '670aa5b834951486809e8fa2', required: false})
  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  profesorId: string;

  @ApiProperty({example: '670aa5b834951486809e8fa3', required: false})
  @IsString()
  @IsOptional()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  idiomaId: string;

  @ApiProperty({example: '6792877e2942e670016454de'})
  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  planetaId: string;
}
