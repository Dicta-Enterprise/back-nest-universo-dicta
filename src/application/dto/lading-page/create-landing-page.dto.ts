import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

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
}
