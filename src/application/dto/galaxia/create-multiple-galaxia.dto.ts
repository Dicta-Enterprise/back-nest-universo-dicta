import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Vector3Dto } from './vector/vector-galaxia.dto';

export class GalaxiaDataDto {
  @ApiPropertyOptional({
    example: 'salud-mental',
    description: 'Tema de la galaxia para motor 3D',
  })
  @IsString()
  @IsNotEmpty()
  tema: string;

  @ApiPropertyOptional({
    example: 'Salud Social 1',
    description:
      'Nombre individual de la galaxia (opcional, hereda del grupo si no se especifica)',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({
    example: 'Descripción específica de esta galaxia',
    description: 'Descripción individual (opcional, hereda del grupo)',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    example: '689e130abb9772d4bb7b983f',
    description: 'ID de la categoría',
  })
  @IsMongoId()
  @IsNotEmpty()
  categoriaId: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsString()
  @IsNotEmpty()
  imagen: string | null;

  @ApiProperty({ example: 'https://example.com/salud-social' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'salud-social-textura.png' })
  @IsString()
  @IsNotEmpty()
  textura: string;

  @ApiProperty({ example: '#FE797B' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsNotEmpty()
  estado?: boolean;

  @ApiProperty({ example: { x: -13, y: 1, z: 3 } })
  @ValidateNested()
  @Type(() => Vector3Dto)
  @IsNotEmpty()
  posicion: Vector3Dto;

  @ApiProperty({ example: { x: 1.847995880179171, y: 0, z: 5 } })
  @ValidateNested()
  @Type(() => Vector3Dto)
  @IsNotEmpty()
  rotacion: Vector3Dto;
}

export class CreateMultipleGalaxiasDto {
  @ApiProperty({
    type: [GalaxiaDataDto],
    description: 'Array de galaxias a crear',
    example: [
      {
        categoriaId: '689e130abb9772d4bb7b983f',
        imagen: null,
        url: 'https://example.com/salud-social',
        textura: 'salud-social-textura.png',
        color: '#FE797B',
        posicion: { x: -13, y: 1, z: 3 },
        rotacion: { x: 1.847995880179171, y: 0, z: 5 },
        nombre: 'Salud Social Infantil',
        descripcion: 'Versión para niños',
        tema: 'salud-social-infantil',
        estado: true,
        categoria: 'Jovenes',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => GalaxiaDataDto)
  galaxias: GalaxiaDataDto[];
}
