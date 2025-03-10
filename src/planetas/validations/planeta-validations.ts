import { EstadoGenerico } from '@prisma/client';
import { Transform } from 'class-transformer';
import { 
  IsString, IsNotEmpty, Length, IsOptional, IsEnum, IsDate, IsMongoId 
} from 'class-validator';

export class PlanetaValidations {
  static nombre() {
    return function (target: any, propertyKey: string) {
      IsString({ message: 'El nombre del planeta debe ser un texto' })(target, propertyKey);
      IsNotEmpty({ message: 'El nombre no puede estar vacío' })(target, propertyKey);
      Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })(target, propertyKey);
      Transform(({ value }) => value.trim())(target, propertyKey);
    };
  }

  static descripcion() {
    return function (target: any, propertyKey: string) {
      IsString({ message: 'La descripción debe ser un texto' })(target, propertyKey);
      IsNotEmpty({ message: 'La descripción no puede estar vacía' })(target, propertyKey);
      Length(10, 200, { message: 'La descripción debe tener entre 10 y 200 caracteres' })(target, propertyKey);
    };
  }

  static imagen() {
    return function (target: any, propertyKey: string) {
      IsString({ message: 'La imagen debe ser una URL válida' })(target, propertyKey);
      IsNotEmpty({ message: 'La imagen es obligatoria' })(target, propertyKey);
    };
  }

  static galaxiaId() {
    return function (target: any, propertyKey: string) {
      IsMongoId({ message: 'El ID de la galaxia debe ser un MongoID válido' })(target, propertyKey);
      IsNotEmpty({ message: 'El ID de la galaxia es obligatorio' })(target, propertyKey);
    };
  }

  static estado() {
    return function (target: any, propertyKey: string) {
      IsOptional()(target, propertyKey);
      IsEnum(EstadoGenerico, {
        message: 'Estado inválido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
      })(target, propertyKey);
    };
  }

  static fechaCreacion() {
    return function (target: any, propertyKey: string) {
      IsOptional()(target, propertyKey);
      IsDate({ message: 'La fecha de creación debe ser válida' })(target, propertyKey);
    };
  }
}
