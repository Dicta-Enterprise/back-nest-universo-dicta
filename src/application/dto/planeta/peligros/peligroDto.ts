import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PeligroDto {
  @ApiProperty({
    example: 'Conflictos no resueltos',
    description: 'Nombre del peligro',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  nombre: string;

  @ApiProperty({
    example: 'Situaciones de tensión que pueden escalar si no se manejan adecuadamente',
    description: 'Descripción detallada del peligro',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  descripcion: string;

  @ApiProperty({
    example: 'Alto',
    description: 'Nivel de riesgo del peligro',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  nivelRiesgo?: string;

  @ApiProperty({
    example: 'Caliente',
    description: 'Temperatura asociada al peligro (metáfora del nivel de conflicto)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  temperatura?: string;

  @ApiProperty({
    example: 'La Ira',
    description: 'Personaje villano asociado al peligro',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  villano?: string;

  @ApiProperty({
    example: 'Aprende a manejar tus emociones',
    description: 'Call to Action para superar el peligro',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  cta?: string;
}
