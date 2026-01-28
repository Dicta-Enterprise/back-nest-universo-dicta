import { Categoria } from '@entities/categoria/categoria.entity';
import { Prisma, Categoria as PrismaCategoria } from '@prisma/client';

type CategoriaConGalaxia = Prisma.CategoriaGetPayload<{
  include: {
    galaxias: {
      select: { nombre: true };
    };
  };
}>;

export interface CategoriaFactory {
  crearDesdePrisma(prisma: PrismaCategoria): Categoria;
  crearDesdePrismaConGalaxias(prisma: CategoriaConGalaxia): Categoria;
}

export class DefaultCategoriaFactory implements CategoriaFactory {
  crearDesdePrisma(prisma: PrismaCategoria): Categoria {
    return new Categoria(
      prisma.id,
      prisma.nombre,
      prisma.descripcion,
      prisma.estado,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
    );
  }

  crearDesdePrismaConGalaxias(prisma: CategoriaConGalaxia): Categoria {
    return new Categoria(
      prisma.id,
      prisma.nombre,
      prisma.descripcion,
      prisma.estado,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
    );
  }
}
