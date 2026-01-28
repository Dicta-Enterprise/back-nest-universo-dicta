import { ItemColores } from '@prisma/client';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ItemImagenLanding } from 'src/core/entities/landing-page/item-imagen-landing.entity';

export class CreateLandingPageDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsString()
  imagenPrincipal: string;

  @IsArray()
  @IsString({ each: true })
  contenido: string[];

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsString()
  slug: string;

  @IsString()
  metaKeywords: string;

  @IsString()
  landingUrl: string;

  @IsArray()
  itemImagenesLanding: ItemImagenLanding[];

  @IsArray()
  itemColores: ItemColores[];
}
