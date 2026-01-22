import { Planeta } from '@entities/planeta/planeta.entity';
import { Prisma, Planeta as PrismaPlaneta } from '@prisma/client';

type PlanetaConGalaxia = Prisma.PlanetaGetPayload<{
  include: {
    galaxia: {
      select: { nombre: true };
    };
  };
}>;

export interface PlanetaFactory {
  crearDesdePrisma(prisma: PrismaPlaneta): Planeta;
  crearDesdePrismaConGalaxias(prisma: PlanetaConGalaxia): Planeta;
}

export class DefaultPlanetaFactory implements PlanetaFactory {
  crearDesdePrisma(prisma: PrismaPlaneta): Planeta {
    return new Planeta(
      prisma.id,
      prisma.nombre,
      prisma.grupo,
      prisma.tema,
      prisma.textura,
      prisma.url,
      prisma.imagenResumen,
      prisma.imagenBeneficios,
      prisma.resumenCurso,
      prisma.estado,
      prisma.info,
      prisma.peligros,
      prisma.beneficios,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
      prisma.galaxiaId,
    );
  }

  crearDesdePrismaConGalaxias(prisma: PlanetaConGalaxia): Planeta {
    return new Planeta(
      prisma.id,
      prisma.nombre,
      prisma.grupo,
      prisma.tema,
      prisma.textura,
      prisma.url,
      prisma.imagenResumen,
      prisma.imagenBeneficios,
      prisma.resumenCurso,
      prisma.estado,
      prisma.info,
      prisma.peligros,
      prisma.beneficios,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
      prisma.galaxiaId,
    );
  }
}
