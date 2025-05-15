import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ItemImagen } from 'src/core/entities/estandar/item.imagen.entity';

export class CreateGalaxiaDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  estado: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion: Date;

  @ValidateNested({ each: true })
  @Type(() => ItemImagen)
  @IsArray()
  itemImagen: ItemImagen[];
}
