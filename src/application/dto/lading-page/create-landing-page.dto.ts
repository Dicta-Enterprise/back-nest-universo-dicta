import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
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
    example: ['Bloque 1', 'Bloque 2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  contenido: string[];

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

  @ApiProperty({ example: 'curso, ingles, intensivo' })
  @IsString()
  @Length(3, 300)
  metaKeywords: string;

  @ApiProperty({ example: 'https://midominio.com/curso-ingles' })
  @IsUrl()
  landingUrl: string;

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
