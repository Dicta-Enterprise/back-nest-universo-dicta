import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class Galaxia3DResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'ID de la galaxia' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'salud-mental', description: 'Tema para motor 3D' })
  tema: string;

  @Expose()
  @ApiProperty({ example: '#f2f3f2ff', description: 'Color hexadecimal' })
  color: string;

  @Expose()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      return [value.x || 0, value.y || 0, value.z || 0];
    }
    return [0, 0, 0];
  })
  @ApiProperty({ 
    example: [0, 8, 4], 
    description: 'Posición 3D en formato array para Three.js',
    type: [Number]
  })
  posicion: number[];

  @Expose()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      return [value.x || 0, value.y || 0, value.z || 0];
    }
    return [0, 0, 0];
  })
  @ApiProperty({ 
    example: [1.847995880179171, 0, 5], 
    description: 'Rotación 3D en formato array para Three.js',
    type: [Number]
  })
  rotacion: number[];

  @Expose()
  @ApiProperty({ example: true, description: 'Estado activo/inactivo' })
  active: boolean;

  @Expose()
  @ApiProperty({ example: '689e130abb9772d4bb7b983f', description: 'ID de categoría' })
  categoriaId: string;

  @Expose()
  @ApiProperty({ example: 'Salud Social', description: 'Nombre visible' })
  nombre: string;

  @Expose()
  @ApiProperty({ example: 'Galaxia sobre relaciones interpersonales' })
  descripcion: string;

  @Expose()
  @ApiProperty({ 
    example: 'https://storage.example.com/imagen.jpg', 
    required: false,
    nullable: true 
  })
  imagen?: string | null;

  @Expose()
  @ApiProperty({ 
    example: 'salud-social-textura.png', 
    required: false 
  })
  textura?: string;

  @Expose()
  @ApiProperty({ example: 'https://example.com/galaxia', required: false })
  url?: string;
}