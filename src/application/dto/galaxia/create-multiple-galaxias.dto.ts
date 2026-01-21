import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Vector3Dto } from './vector/vector-galaxia.dto';

class GalaxiaDataDto {
  @IsString()
  categoriaId: string;

  @IsOptional()
  @IsString()
  imagen?: string | null;

  @IsUrl()
  url: string;

  @IsString()
  textura: string;

  @IsString()
  color: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Vector3Dto)
  posicion: Vector3Dto;

  @IsObject()
  @ValidateNested()
  @Type(() => Vector3Dto)
  rotacion: Vector3Dto;
}

export class CreateMultipleGalaxiasDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GalaxiaDataDto)
  galaxias: GalaxiaDataDto[];
}
