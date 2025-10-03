import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class InfoPlanetaDto {
  @ApiProperty({
    example: 'Conflicto interpersonal',
    description: 'Tipo de riesgo del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  tipoRiesgo: string;

  @ApiProperty({
    example: 'Mediano',
    description: 'Tamaño del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  tamano: string;

  @ApiProperty({
    example: 'Rocoso con atmósfera densa',
    description: 'Composición del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  composicion: string;

  @ApiProperty({
    example: 'Alto - Requiere habilidades de comunicación',
    description: 'Descripción del nivel de riesgo',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  riesgo: string;

  @ApiProperty({
    example: 'Intermedio',
    description: 'Nivel de dificultad del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nivel: string;

  @ApiProperty({
    example: 'Tenso y desafiante',
    description: 'Ambiente del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  ambiente: string;

  @ApiProperty({
    example: 'Caliente',
    description: 'Temperatura del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  temperatura: string;

  @ApiProperty({
    example: 'La Ira',
    description: 'Villano principal del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  villano: string;
}
