import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
  IsMongoId,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';

class ColorDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

class PosicionDto {
  @IsInt()
  x: number;

  @IsInt()
  y: number;
}

class AtributoDto {
  @ValidateNested()
  @Type(() => PosicionDto)
  posicion: PosicionDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorDto)
  colores: ColorDto[];
}

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
  estado: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion: Date;

  @IsMongoId({ message: 'El campo categoriaId debe ser un ID de Mongo válido' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoriaId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AtributoDto)
  atributos?: AtributoDto[];
}
