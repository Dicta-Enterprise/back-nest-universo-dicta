import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateItemImagenLandingDto } from './create-item-imagen-landing.dto';
import { CreateItemColorDto } from './create-item-color.dto';

export class CreateLandingPageDto {
  @ApiProperty({
    description: 'El título principal de la Landing Page, idealmente llamativo y claro.',
    example: 'Salud Mental para Jóvenes',
  })
  @IsString()
  @Length(5, 150)
  titulo: string;

  @ApiProperty({
    description: 'Una descripción detallada sobre el propósito y el contenido de la Landing Page.',
    example: 'Aprende a gestionar emociones, estrés y ansiedad mediante actividades interactivas.',
  })
  @IsString()
  @Length(10, 500)
  descripcion: string;

  @ApiProperty({
    description: 'URL de la imagen principal o hero banner (debe ser una URL válida).',
    example: 'https://dicta.com/images/salud-mental-banner.webp',
  })
  @IsUrl()
  imagenPrincipal: string;

  @ApiProperty({
    description: 'Estructura flexible en formato JSON que contiene el contenido dinámico de la página dividido en diferentes bloques o secciones. Puede ser un Array o un Objeto según la estructura dinámica.',
    example: [
      {
        tipo: 'banner',
        titulo: 'Bienvenido a Salud Mental',
        descripcion: 'Descubre herramientas para mejorar tu bienestar emocional.',
        imagen: {
          url: 'https://dicta.com/images/banner-salud.webp',
          alt: 'Banner Salud Mental',
        },
        botones: [
          {
            texto: 'Comenzar',
            url: '/universo/planetas/salud-mental',
          },
          {
            texto: 'Ver Cursos',
            url: '/cursos',
          },
        ],
      },
      {
        tipo: 'texto-imagen',
        layout: 'texto-imagen',
        titulo: '¿Qué aprenderás?',
        texto: 'Aprenderás técnicas para controlar la ansiedad, fortalecer la autoestima y mejorar tus relaciones personales.',
        imagen: {
          url: 'https://dicta.com/images/aprendizaje.webp',
          alt: 'Aprendizaje',
        },
      },
      {
        tipo: 'beneficios',
        titulo: 'Beneficios',
        items: [
          'Actividades interactivas',
          'Contenido adaptado para jóvenes',
          'Ejercicios prácticos',
          'Acceso desde cualquier dispositivo',
        ],
      },
      {
        tipo: 'galeria',
        imagenes: [
          {
            url: 'https://dicta.com/images/galeria1.webp',
            descripcion: 'Actividad emocional',
          },
          {
            url: 'https://dicta.com/images/galeria2.webp',
            descripcion: 'Trabajo colaborativo',
          },
        ],
      },
      {
        tipo: 'video',
        titulo: 'Video introductorio',
        url: 'https://youtube.com/watch?v=abc123',
      },
      {
        tipo: 'llamadaAccion',
        titulo: '¿Listo para comenzar?',
        descripcion: 'Explora el planeta Salud Mental and desarrolla nuevas habilidades emocionales.',
        botones: [
          {
            texto: 'Explorar Planeta',
            url: '/universo/planetas/salud-mental',
          },
        ],
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsObject()
  secciones?: Record<string, unknown>;

  @ApiProperty({
    description: 'Indica si la Landing Page se encuentra activa y visible (true) o inactiva (false). Por defecto suele ser true.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @ApiProperty({
    description: 'El identificador amigable para la URL (slug). Debe ser único y estar en formato kebab-case.',
    example: 'salud-mental-jovenes',
  })
  @IsString()
  @Length(3, 200)
  slug: string;

  @ApiProperty({
    description: 'Configuración para Search Engine Optimization en formato JSON. Se utiliza para meta tags de la página.',
    example: {
      metaTitle: 'Salud Mental para Jóvenes | Universo Dictariano',
      metaDescription: 'Aprende a gestionar emociones, ansiedad y bienestar emocional mediante actividades interactivas.',
      keywords: [
        'salud mental',
        'emociones',
        'ansiedad',
        'jovenes',
        'bienestar emocional',
      ],
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  seo?: Record<string, unknown>;

  @ApiProperty({
    description: 'El ID (MongoDB ObjectID) del Planeta al cual está asociada esta Landing Page, usado para filtros y relaciones complejas.',
    example: '689e130abb9772d4bb7b983f',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  planetaId?: string;

  @ApiProperty({
    description: 'Lista de imágenes secundarias asociadas a la Landing Page.',
    type: [CreateItemImagenLandingDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemImagenLandingDto)
  itemImagenesLanding: CreateItemImagenLandingDto[];

  @ApiProperty({
    description: 'Lista de colores temáticos asociados a la Landing Page para la interfaz.',
    type: [CreateItemColorDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemColorDto)
  itemColores: CreateItemColorDto[];
}
