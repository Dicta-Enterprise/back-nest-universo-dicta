import { LandingPage } from '@entities/landing-page/landing-page.entity';
import { Prisma, LandingPage as PrismaLandingPage } from '@prisma/client';

type LandingPageConCursos = Prisma.LandingPageGetPayload<{
  include: {
    itemColores: {
      select: { color: true };
    };
  };
}>;

export interface LandingPageFactory {
  crearDesdePrisma(prisma: PrismaLandingPage): LandingPage;
  crearDesdePrismaConCursos(prisma: LandingPageConCursos): LandingPage;
}

export class DefaultLandingPageFactory implements LandingPageFactory {
  crearDesdePrisma(prisma: PrismaLandingPage): LandingPage {
    return new LandingPage(
      prisma.id,
      prisma.titulo,
      prisma.descripcion,
      prisma.imagenPrincipal,
      prisma.contenido,
      prisma.estado,
      prisma.slug,
      prisma.metaKeywords,
      prisma.landingUrl,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
      null,
      null,
    );
  }
  crearDesdePrismaConCursos(prisma: LandingPageConCursos): LandingPage {
    return new LandingPage(
      prisma.id,
      prisma.titulo,
      prisma.descripcion,
      prisma.imagenPrincipal,
      prisma.contenido,
      prisma.estado,
      prisma.slug,
      prisma.metaKeywords,
      prisma.landingUrl,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
      null,
      null,
    );
  }
}
