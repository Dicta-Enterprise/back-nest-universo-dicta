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
  @ApiProperty({ example: 'Landing Curso de Inglés' })
  @IsString()
  @Length(5, 150)
  titulo: string;

  @ApiProperty({ example: 'Landing oficial del curso intensivo' })
  @IsString()
  @Length(10, 500)
  descripcion: string;

  @ApiProperty({ example: 'https://midominio.com/banner.jpg' })
  @IsUrl()
  imagenPrincipal: string;

  @ApiProperty({
    example: { header: 'Bienvenido', body: 'Contenido principal' },
  })
  @IsOptional()
  @IsObject()
  secciones?: Record<string, unknown>;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @ApiProperty({ example: 'landing-curso-ingles' })
  @IsString()
  @Length(3, 200)
  slug: string;

  @ApiProperty({ example: { keywords: ['curso', 'ingles'], title: 'Curso SEO' } })
  @IsOptional()
  @IsObject()
  seo?: Record<string, unknown>;

  @ApiProperty({
    example: '60c72b2f9b1e8a001c8e4c1a',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  planetaId?: string;

  @ApiProperty({
    type: [CreateItemImagenLandingDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemImagenLandingDto)
  itemImagenesLanding: CreateItemImagenLandingDto[];

  @ApiProperty({
    type: [CreateItemColorDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemColorDto)
  itemColores: CreateItemColorDto[];
}
