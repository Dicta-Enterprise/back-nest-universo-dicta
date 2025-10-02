import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { InfoPlanetaDto } from './Informacion/infoPlanetaDto';
import { PeligroDto } from './Peligros/peligroDto';
import { BeneficioDto } from './Beneficio/beneficioDto';
import { EstadoGenerico } from '@prisma/client';

export class CreatePlanetaDto {
  @ApiProperty({
    example: 'Planeta de Comunicación Asertiva',
    description: 'Nombre del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  nombre: string;

  @ApiProperty({
    example: 'NIÑOS',
    description: 'Grupo al que pertenece el planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  grupo: string;

  @ApiProperty({
    example: 'Calmito el mejor',
    description: 'Nombre específico del planeta en el universo',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  planetaNombre: string;

  @ApiProperty({
    example: 'SALUD_MENTAL',
    description: 'Tema principal del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  tema: string;

  @ApiProperty({
    example: '/assets/2k_neptune.jpg',
    description: 'Nombre del archivo de textura para renderizado 3D',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  textura: string;

  @ApiProperty({
    example: '/galaxia/ninos/salud-mental/calmito',
    description: 'URL del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  url: string;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXN0cm9uYXV0fGVufDB8fDB8fHww',
    description: 'URL de la imagen de resumen del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  imagenResumen: string;

  @ApiProperty({
    example: 'https://tn.com.ar/resizer/v2/cual-es-el-sueldo-de-un-astronauta-de-la-nasa-foto-adobestock-OVP5HZHY7NHB3PWLAVL5ARG66A.png?auth=a3e77c7ff1be7c62dfc79ca3276dbc43d99ec81620644ed5637f4993c154dad4&width=767',
    description: 'URL de la imagen de beneficios del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  imagenBeneficios: string;

  @ApiProperty({
    example: 'Este curso te llevará a través de los conceptos básicos y avanzados del planeta Kio, explorando: Geografía única, clima extremo y desafíos tecnológicos.',
    description: 'Resumen del curso del planeta',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
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
    example: '2025-10-01T10:30:00.000Z',
    description: 'Fecha de creación del planeta',
    type: Date,
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion?: Date;

  @ApiProperty({
    example: '2025-10-01T10:30:00.000Z',
    description: 'Fecha de última actualización del planeta',
    type: Date,
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion?: Date;

  @ApiProperty({
    example: '64f27cdb7b97a2e89f2f7c12',
    description: 'ID de la galaxia a la que pertenece el planeta (ObjectId de MongoDB)',
  })
  @IsMongoId({ message: 'El campo GalaxiaId debe ser un ID de Mongo válido' })
  @IsNotEmpty({ message: 'La Galaxia es obligatoria' })
  galaxiaId: string;
}
