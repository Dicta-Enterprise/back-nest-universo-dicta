import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Vector3Dto } from './vector/vector-galaxia.dto';
import { Categoria } from '@entities/categoria/categoria.entity';

export class CreateGalaxiaDto {
  @ApiProperty({ example: 'salud-mental', description: 'Tema de la galaxia usado por el motor 3D' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  tema?: string;

  @ApiProperty({ example: 'Salud Emocional', description: 'Nombre visible de la galaxia en ADMIN' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @ApiProperty({ example: 'Galaxia dedicada al aprendizaje sobre salud emocional' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: '#FE797B', description: 'Color de la galaxia en formato hexadecimal' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: true, description: 'Estado de la galaxia', default: true })
  @IsBoolean()
  @IsNotEmpty()
  estado: boolean;

  @ApiProperty({ example: 'Jovenes', description: 'Categoría a la que pertenece la galaxia' })
  @IsNotEmpty()
  categoria: Categoria;

  @ApiProperty({ example: '689e130abb9772d4bb7b983f', description: 'ID de la categoría' })
  @IsMongoId()
  @IsNotEmpty()
  categoriaId: string;

  @ApiProperty({
    example: { x: -13, y: 1, z: 3 },
    description: 'Posición 3D de la galaxia (objeto o array)',
    required: true,
  })
  @Transform(({ value }) => {
    if (!value) return { x: 0, y: 0, z: 0 };
    if (Array.isArray(value)) {
      return { 
        x: value[0] ?? 0, 
        y: value[1] ?? 0, 
        z: value[2] ?? 0 
      };
    }
    return {
      x: value.x ?? 0,
      y: value.y ?? 0,
      z: value.z ?? 0
    };
  })
  @ValidateNested()
  @Type(() => Vector3Dto)
  @IsOptional()
  posicion?: Vector3Dto;

  @ApiProperty({
    example: { x: 1.84, y: 0, z: 5 },
    description: 'Rotación 3D de la galaxia (objeto o array)',
    required: true,
  })
  @Transform(({ value }) => {
    if (!value) return { x: 0, y: 0, z: 0 };
    if (Array.isArray(value)) {
      return { 
        x: value[0] ?? 0, 
        y: value[1] ?? 0, 
        z: value[2] ?? 0 
      };
    }
    return {
      x: value.x ?? 0,
      y: value.y ?? 0,
      z: value.z ?? 0
    };
  })
  @ValidateNested()
  @Type(() => Vector3Dto)
  @IsOptional()
  rotacion?: Vector3Dto;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  imagen?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/galaxia' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ example: 'salud-social-textura.png' })
  @IsOptional()
  @IsString()
  textura?: string;

  @ApiPropertyOptional({ example: new Date(), description: 'Fecha de creación' })
  @IsOptional()
  fechaCreacion?: Date;

  @ApiPropertyOptional({ example: new Date(), description: 'Fecha de actualización' })
  @IsOptional()
  fechaActualizacion?: Date;

}