import { CreateMultipleGalaxiasDto } from '@dto/galaxia/create-multiple-galaxia.dto';
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
  crearRequest(createGalaxiaDto: CreateMultipleGalaxiasDto): Galaxia[];
  crearDesdePrisma(prisma: PrismaGalaxia): Galaxia;
  crearDesdePrismaConCategorias(prisma: GalaxiaConCategoria): Galaxia;
}

export class DefaultGalaxiaFactory implements GalaxiaFactory {
  crearRequest(createGalaxiaDto: CreateMultipleGalaxiasDto): Galaxia[] {
    const galaxias: Galaxia[] = createGalaxiaDto.galaxias.map((galaxia) => {
      return new Galaxia(
        null,
        galaxia.nombre,
        galaxia.tema,
        galaxia.descripcion,
        galaxia.imagen ?? null,
        galaxia.url,
        galaxia.textura,
        galaxia.estado ?? true,
        new Date(),
        new Date(),
        galaxia.categoriaId,
        galaxia.color,
        galaxia.posicion,
        galaxia.rotacion,
      );
    });

    return galaxias;
  }

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
      prisma.categoriaId,
      prisma.color,
      prisma.posicion,
      prisma.rotacion,
    );
  }
}
