import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class InfoPlanetaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  tipoRiesgo: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  tamano: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  composicion: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  riesgo: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nivel: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  ambiente: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  temperatura: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  villano: string;
}
