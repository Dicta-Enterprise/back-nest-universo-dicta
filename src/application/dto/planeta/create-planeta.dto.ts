import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { InfoPlanetaDto } from './Informacion/infoPlanetaDto';
import { PeligroDto } from './Peligros/peligroDto';
import { BeneficioDto } from './Beneficio/beneficioDto';
import { EstadoGenerico } from '@prisma/client';

export class CreatePlanetaDto {
  @ApiProperty({
    example: 'PLAN-001',
    description: 'Código único del planeta',
  })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({
    example: 'Planeta de Comunicación Asertiva',
    description: 'Nombre del planeta',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'NIÑOS',
    description: 'Grupo al que pertenece el planeta',
  })
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @ApiProperty({
    example: 'SALUD_MENTAL',
    description: 'Tema principal del planeta',
  })
  @IsString()
  @IsNotEmpty()
  galaxia: string;

  @ApiProperty({
    example: '/assets/2k_neptune.jpg',
    description: 'Nombre del archivo de textura para renderizado 3D',
  })
  @IsString()
  @IsNotEmpty()
  textura: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXN0cm9uYXV0fGVufDB8fDB8fHww',
    description: 'URL del planeta',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXN0cm9uYXV0fGVufDB8fDB8fHww',
    description: 'URL de la imagen de resumen del planeta',
  })
  @IsString()
  @IsNotEmpty()
  imagenResumen: string;

  @ApiProperty({
    example: 'Este curso te llevará a través de los conceptos básicos y avanzados del planeta Kio, explorando: Geografía única, clima extremo y desafíos tecnológicos.',
    description: 'Resumen del curso del planeta',
  })
  @IsString()
  @IsNotEmpty()
  resumenCurso: string;

  @ApiProperty({
    example: 'ACTIVO',
    description: 'Estado del planeta',
    enum: EstadoGenerico,
    required: false,
  })
  @IsEnum(EstadoGenerico, {
    message: `El estado debe ser uno de los siguientes valores: ${Object.values(EstadoGenerico).join(', ')}`,
  })
  @IsOptional()
  estado?: EstadoGenerico;

  @ApiProperty({
    example: {
      tipoRiesgo: 'Conflicto interpersonal',
      tamano: 'Mediano',
      composicion: 'Rocoso con atmósfera densa',
      riesgo: 'Alto - Requiere habilidades de comunicación',
      nivel: 'Intermedio',
      ambiente: 'Tenso y desafiante',
      temperatura: 'Caliente',
      villano: 'La Ira',
    },
    description: 'Información detallada del planeta',
    type: InfoPlanetaDto,
  })
  @ValidateNested()
  @Type(() => InfoPlanetaDto)
  @IsNotEmpty()
  info: InfoPlanetaDto;

  @ApiProperty({
    example: [
      {
        nombre: 'Conflictos no resueltos',
        descripcion: 'Situaciones de tensión que pueden escalar',
        nivelRiesgo: 'Alto',
        temperatura: 'Caliente',
        villano: 'La Ira',
        cta: 'Aprende a manejar tus emociones',
      },
    ],
    description: 'Lista de peligros del planeta',
    type: [PeligroDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PeligroDto)
  @IsOptional()
  peligros?: PeligroDto[];

  @ApiProperty({
    example: [
      {
        titulo: 'Aprenderás a manejar conflictos',
        descripcion: 'Desarrollarás habilidades de comunicación asertiva',
      },
    ],
    description: 'Lista de beneficios del planeta',
    type: [BeneficioDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BeneficioDto)
  @IsOptional()
  beneficios?: BeneficioDto[];

  @ApiProperty({
    example: '6997c5ad82bdf1267be250a6',
    description: 'ID de la galaxia a la que pertenece el planeta (ObjectId de MongoDB)',
  })
  @IsMongoId()
  @IsNotEmpty()
  galaxiaId: string;
}