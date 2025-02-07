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
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  nombre: string;

  @ApiProperty({example: 'Un curso diseñado para ...'})
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  descripcion: string;

  @ApiProperty({example: new Date()})
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @MinDate(new Date())
  fechaInicio: Date;

  @ApiProperty({example: new Date()})
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @MinDate(new Date())
  @IsFechaValida()
  fechaFinalizacion: Date;

  @ApiProperty({example: 20})
  @IsNumber()
  @IsDefined()
  @IsPositive()
  cantidadAlumnos: number;

  @ApiProperty({example: 1000})
  @IsNumber()
  @IsPositive()
  @IsDefined()
  precio: number;

  @ApiProperty({example: 'ACTIVO', enum: EstadoGenerico})
  @IsString()
  @IsEnum(EstadoGenerico, {
    message:
      'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
  })
  estado: EstadoGenerico;

  @ApiProperty({example: 'https://example.com/curso-imagen2.jpg'})
  @IsUrl()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  imagen: string;

  @ApiProperty({example: 'https://example.com/curso-video.mp4'})
  @IsUrl()
  @Transform(({ value }) => ( typeof value == 'string' ? value.trim(): value))
  video: string;

  @ApiProperty({example: 40})
  @IsNumber()
  @IsPositive()
  @IsDefined()
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
