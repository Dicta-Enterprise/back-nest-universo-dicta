import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({
    example: 'Niños',
    description: 'Nombre de la categoría (solo se permiten 3 categorías: NIÑOS, JÓVENES, ADULTOS)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @ApiProperty({
    example: 'Categoría para contenido educativo dirigido a niños',
    description: 'Descripción de la categoría',
    required: false,
  })
  @IsOptional()
  descripcion: string;

  @ApiProperty({
    example: true,
    description: 'Estado de la categoría (activo/inactivo)',
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true) // 👈 convierte string a boolean
  @IsBoolean()
  estado: boolean;

  @ApiProperty({
    example: '2025-10-01T10:30:00.000Z',
    description: 'Fecha de creación de la categoría',
    type: Date,
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @ApiProperty({
    example: '2025-10-01T10:30:00.000Z',
    description: 'Fecha de última actualización de la categoría',
    type: Date,
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion: Date;

  @ApiProperty({
    example: 0,
    description: 'Coordenada X en el espacio 3D del universo',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  x?: number;

  @ApiProperty({
    example: 5,
    description: 'Coordenada Y en el espacio 3D del universo',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  y?: number;

  @ApiProperty({
    example: -10,
    description: 'Coordenada Z en el espacio 3D del universo',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  z?: number;

  @ApiProperty({
    example: 'https://png.pngtree.com/png-vector/20241018/ourmid/pngtree-3d-class-tripp-happy-children-with-white-background-png-image_14109691.png',
    description: 'URL de la categoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    example: '/assets/cohete/scene.gltf',
    description: 'Nombre del archivo del modelo 3D de la categoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  modelo?: string;
}
