import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
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
  @IsOptional()
  @IsString()
  tema?: string;

  @ApiProperty({
    example: 'Salud Social Infantil',
    description: 'Nombre de la galaxia',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'Descripción específica de esta galaxia',
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

  @ApiPropertyOptional({
    example: null,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  imagen?: string | null;

  @ApiProperty({
    example: 'https://example.com/salud-social',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 'salud-social-textura.png',
  })
  @IsString()
  @IsNotEmpty()
  textura: string;

  @ApiProperty({
    example: '#FE797B',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @ApiProperty({
    example: { x: -13, y: 1, z: 3 },
  })
  @ValidateNested()
  @Type(() => Vector3Dto)
  posicion: Vector3Dto;

  @ApiProperty({
    example: { x: 1.84, y: 0, z: 5 },
  })
  @ValidateNested()
  @Type(() => Vector3Dto)
  rotacion: Vector3Dto;
}

export class CreateMultipleGalaxiasDto {
  @ApiProperty({
    type: [GalaxiaDataDto],
    description: 'Array de galaxias a crear',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => GalaxiaDataDto)
  galaxias: GalaxiaDataDto[];
}