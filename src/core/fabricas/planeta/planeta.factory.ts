import { Planeta } from '@entities/planeta/planeta.entity';
import { Prisma } from '@prisma/client';

type PlanetaConGalaxia = Prisma.PlanetaGetPayload<{
  include: {
    galaxia: {
      select: { nombre: true };
    };
  };
}>;

export interface PlanetaFactory {
  crearDesdePrisma(prisma: PlanetaConGalaxia): Planeta;
  crearDesdePrismaConGalaxias(prisma: PlanetaConGalaxia): Planeta;
}

export class DefaultPlanetaFactory implements PlanetaFactory {
  crearDesdePrisma(prisma: PlanetaConGalaxia): Planeta {
    return new Planeta(
      prisma.id,
      prisma.nombre,
      prisma.categoria,
      prisma.galaxia.nombre,
      prisma.textura,
      prisma.url,
      prisma.imagenResumen,
      prisma.resumenCurso,
      prisma.estado,
      prisma.galaxiaId,
      prisma.info,
      prisma.peligros,
      prisma.beneficios,
    );
  }

  crearDesdePrismaConGalaxias(prisma: PlanetaConGalaxia): Planeta {
    return new Planeta(
      prisma.id,
      prisma.nombre,
      prisma.categoria,
      prisma.galaxia.nombre,
      prisma.textura,
      prisma.url,
      prisma.imagenResumen,
      prisma.resumenCurso,
      prisma.estado,
      prisma.galaxiaId,
      prisma.info,
      prisma.peligros,
      prisma.beneficios,
    );
  }
}