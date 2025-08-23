import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsEnum,
} from 'class-validator';
import { InfoPlanetaDto } from './Informacion/infoPlanetaDto';
import { PeligroDto } from './Peligros/peligroDto';
import { BeneficioDto } from './Beneficio/beneficioDto';
import { EstadoGenerico } from '@prisma/client';

const trim = ({ value }: { value: any }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreatePlanetaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  grupo: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  planetaNombre: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  tema: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  textura: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  url: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  imagenResumen: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  imagenBeneficios: string;

  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  resumenCurso: string;

  @IsEnum(EstadoGenerico, {
    message: `El estado debe ser uno de los siguientes valores: ${Object.values(EstadoGenerico).join(', ')}`,
  })
  @IsOptional()
  estado?: EstadoGenerico;

  @ValidateNested()
  @Type(() => InfoPlanetaDto)
  @IsNotEmpty()
  info: InfoPlanetaDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PeligroDto)
  @IsOptional()
  peligros?: PeligroDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BeneficioDto)
  @IsOptional()
  beneficios?: BeneficioDto[];

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion?: Date;

  @IsMongoId({ message: 'El campo GalaxiaId debe ser un ID de Mongo válido' })
  @IsNotEmpty({ message: 'La Galaxia es obligatoria' })
  galaxiaId: string;
}
