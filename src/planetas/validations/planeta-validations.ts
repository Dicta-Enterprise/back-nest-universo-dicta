import { EstadoGenerico } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
     IsString,
      IsNotEmpty,
       IsOptional,
        IsEnum,
         IsDate,
        } from 'class-validator';

export const nombreValidation = [
  IsString({ message: 'El nombre del planeta debe ser del tipo String' }),
  IsNotEmpty({ message: 'El campo nombre no debe estar vacío' }),
  Transform(({ value }) => value.trim())
];

export const descripcionValidation = [
  IsString({ message: 'La descripción es de tipo String' }),
  IsNotEmpty({ message: 'La descripción no puede estar vacía' })
];

export const imagenValidation = [
  IsString({ message: 'La imagen debe ser del tipo String' }),
  IsNotEmpty({ message: 'La imagen es obligatoria' })
];


export const estadoValidation = [
  IsOptional(),
  IsEnum(EstadoGenerico, {
    message: 'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.'
  })
];

export const fechaCreacionValidation = [
  IsDate({ message: 'La fecha de creación debe ser una fecha válida' }),
  Type(() => Date)
];

