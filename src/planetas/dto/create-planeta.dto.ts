import { EstadoGenerico } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlanetaDto {
  @IsString({message: "El nombre del planeta debe ser del tipo String"})
  @IsNotEmpty({message: "El campo nombre no debe estar vacio"})
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString({message: "La descripcion es de tipo String"})
  @IsNotEmpty({message: "La descripcion no puede estar vacia"})
  descripcion: string;

  @IsString({message: "la imagen debe ser de tipo String"})
  @IsNotEmpty({message: "la imagen es obligatoria"})
  imagen: string;

  @IsOptional()
  @IsEnum(EstadoGenerico, {
    message:
      'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
  })
  estado: EstadoGenerico;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaActualizacion: Date;

  @IsString()
  @IsNotEmpty({ message: 'El ID de la galaxia es obligatorio' })
  @IsMongoId({ message: 'El ID de la galaxia debe ser un ObjectId válido.' })
  galaxiaId: string;
}