import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Vector3Dto } from './vector/vector-galaxia.dto';

export class CreateGalaxiaDto {
  @ApiProperty({
    example: 'Salud Emocional',
    description: 'Nombre de la galaxia',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @ApiProperty({
    example: 'Galaxia dedicada al aprendizaje sobre salud emocional y bienestar mental',
    description: 'Descripción detallada de la galaxia',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    example: 'null',
    description: 'URL de la imagen de la galaxia',
    required: false,
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({
    example: 'https://example.com/salud-emocional',
    description: 'URL relacionada con la galaxia',
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    example: 'salud-emocional-textura.png',
    description: 'Nombre del archivo de textura para renderizado 3D',
    required: false,
  })
  @IsOptional()
  @IsString()
  textura?: string;

  @ApiProperty({
    example: true,
    description: 'Estado de la galaxia (activo/inactivo)',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  estado: boolean;

  @ApiProperty({
    example: '2025-10-01T10:30:00.000Z',
    description: 'Fecha de creación de la galaxia',
    required: false,
    type: Date,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion?: Date;

  @ApiProperty({
    example: '2025-10-01T10:30:00.000Z',
    description: 'Fecha de última actualización de la galaxia',
    required: false,
    type: Date,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion?: Date;

  @ApiProperty({
    example: '689e130abb9772d4bb7b983f',
    description: 'ID de la categoría a la que pertenece la galaxia (ObjectId de MongoDB)',
    required: true,
  })
  @IsMongoId({ message: 'El campo categoriaId debe ser un ID de Mongo válido' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoriaId: string;

  @ApiProperty({
    example: '#FE797B',
    description: 'Color de la galaxia en formato hexadecimal',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    example: { x: -13, y: 1, z: 3 },
    description: 'Posición de la galaxia en el espacio 3D (coordenadas x, y, z)',
    required: false,
    type: Vector3Dto,
  })
  @IsOptional()
  @Type(() => Vector3Dto)
  posicion?: Vector3Dto;

  @ApiProperty({
    example: { x: 1.847995880179171, y: 0, z: 5 },
    description: 'Rotación de la galaxia en el espacio 3D (ángulos en radianes x, y, z)',
    required: false,
    type: Vector3Dto,
  })
  @IsOptional()
  @Type(() => Vector3Dto)
  rotacion?: Vector3Dto;
}
