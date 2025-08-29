import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Vector3Dto } from './vector/vector-galaxia.dto';

export class CreateGalaxiaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  textura?: string;

  @IsBoolean()
  @IsOptional()
  estado: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion?: Date;

  @IsMongoId({ message: 'El campo categoriaId debe ser un ID de Mongo válido' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoriaId: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsOptional()
  @Type(() => Vector3Dto)
  posicion?: Vector3Dto;

  @IsOptional()
  @Type(() => Vector3Dto)
  rotacion?: Vector3Dto;
}
