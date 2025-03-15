import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsFechaValida(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFechaValida',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const fechaFinalizacion = new Date(value);
          const fechaInicio = new Date(args.object['fechaInicio']); 
  
          if (fechaFinalizacion < fechaInicio) {
            return false;
          }

          return true;
            
        },
        defaultMessage(args: ValidationArguments) {
          return 'La fecha de finalización no puede ser menor a la fecha de inicio.'
        },
      },
    });
  };
}
