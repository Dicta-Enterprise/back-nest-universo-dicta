import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/services/prisma/prisma.service';
import { IParametrosRepository } from '../../../core/repositories/parametros/parametros.repository';
import { PrismaEntity, PrismaFilter, PrismaSelectFields } from '../../../core/types/prisma-types';

@Injectable()
export class ParametrosPrismaRepository implements IParametrosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyFromCollection(
    collection: string,
    filter: PrismaFilter,
    fields: string[]
  ): Promise<PrismaEntity[]> {
    // Acceso dinámico al modelo de Prisma
    // Ejemplo: prisma['categoria'] devuelve el modelo de Categoria
    const model = this.prisma[collection];

    if (!model) {
      throw new Error(
        `Colección '${collection}' no existe en Prisma. Verifica que el nombre coincida con el schema.prisma`
      );
    }

    // Construir objeto select dinámicamente
    // De: ['id', 'nombre', 'descripcion']
    // A: { id: true, nombre: true, descripcion: true }
    const selectFields: PrismaSelectFields = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as PrismaSelectFields);

    // Ejecutar consulta con Prisma
    return await model.findMany({
      where: filter,
      select: selectFields,
    }) as PrismaEntity[];
  }
}
