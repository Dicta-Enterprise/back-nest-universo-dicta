import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function CalculoDuracion(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'calcularDuracion',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const entity = args.object as any;
          if (!entity.fechaInicio || !entity.fechaFinalizacion) return false;

          const inicio = new Date(entity.fechaInicio);
          const final = new Date(entity.fechaFinalizacion);

          if (isNaN(inicio.getTime()) || isNaN(final.getTime())) return false;
          if (final < inicio) return false;

          const duracionHoras = Math.ceil((final.getTime() - inicio.getTime()) / (1000 * 60 * 60));

          entity[propertyName] = duracionHoras; 
          return true;
        },
      },
    });
  };
}
