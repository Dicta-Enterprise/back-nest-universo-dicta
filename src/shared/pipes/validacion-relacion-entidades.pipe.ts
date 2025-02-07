import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ValidarRelacionesPipe implements PipeTransform {

  async transform(value: any, metadata: ArgumentMetadata) {

    const relaciones = [];

    for (const key in value) {
      if (key.endsWith('Id') && value[key]) {
        const entidad = key.replace('Id', ''); // Extrae "categoria" de "categoriaId"
        relaciones.push({ entidad, id: value[key] });
      }
    }

    for (const { entidad, id } of relaciones) {
      if (!id) continue;

      const modelo: any = prisma[entidad];

      if (!modelo) {
        throw new BadRequestException(`La entidad ${entidad} no es válido.`);
      }

      const entidadExistente = await modelo.findUnique({
        where: { id },
      });

      if (!entidadExistente) {
        throw new NotFoundException(`La entidad ${entidad} con ID ${id} no existe.`);
      }
    }

    return value;
  }
}
