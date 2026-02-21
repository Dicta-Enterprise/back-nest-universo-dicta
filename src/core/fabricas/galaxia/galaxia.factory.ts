import { Galaxia } from '@entities/galaxia/galaxia.entity';
import { Prisma, Galaxia as PrismaGalaxia } from '@prisma/client';

type GalaxiaConCategoria = Prisma.GalaxiaGetPayload<{
  include: {
    categoria: {
      select: { nombre: true };
    };
  };
}>;

export interface GalaxiaFactory {
  crearDesdePrisma(prisma: PrismaGalaxia): Galaxia;
  crearDesdePrismaConCategorias(prisma: GalaxiaConCategoria): Galaxia;
}

export class DefaultGalaxiaFactory implements GalaxiaFactory {
  crearDesdePrisma(prisma: PrismaGalaxia): Galaxia {
    return new Galaxia(
      prisma.id,
      prisma.nombre,
      prisma.tema,
      prisma.descripcion,
      prisma.imagen,
      prisma.url,
      prisma.textura,
      prisma.estado,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
      null,
      prisma.categoriaId,
      prisma.color,
      prisma.posicion,
      prisma.rotacion,
    );
  }
  crearDesdePrismaConCategorias(prisma: GalaxiaConCategoria): Galaxia {
    return new Galaxia(
      prisma.id,
      prisma.nombre,
      prisma.tema,
      prisma.descripcion,
      prisma.imagen,
      prisma.url,
      prisma.textura,
      prisma.estado,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
      null,
      prisma.categoriaId,
      prisma.color,
      prisma.posicion,
      prisma.rotacion,
    );
  }
}
