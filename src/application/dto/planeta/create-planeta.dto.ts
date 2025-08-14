import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { InfoPlanetaDto } from './Informacion/infoPlanetaDto'; // ruta al archivo del DTO anidado

export class CreatePlanetaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  grupo: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  tema: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  textura: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  url: string;

  @IsBoolean()
  @IsOptional()
  estado: boolean;

  @ValidateNested()
  @Type(() => InfoPlanetaDto)
  @IsNotEmpty()
  info: InfoPlanetaDto;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion: Date;
  @IsMongoId({ message: 'El campo GalaxiaId debe ser un ID de Mongo válido' })
  @IsNotEmpty({ message: 'La Galaxia es obligatoria' })
  galaxiaId: string;
}
