import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: any }) =>
  typeof value === 'string' ? value.trim() : value;

export class PeligroDto {
  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  descripcion: string;

  @IsString()
  @IsOptional()
  @Transform(trim)
  nivelRiesgo?: string;

  @IsString()
  @IsOptional()
  @Transform(trim)
  temperatura?: string;

  @IsString()
  @IsOptional()
  @Transform(trim)
  villano?: string;

  @IsString()
  @IsOptional()
  @Transform(trim)
  cta?: string;
}
