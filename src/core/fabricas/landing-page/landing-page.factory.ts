import { LandingPage } from '@entities/landing-page/landing-page.entity';
import { Prisma, LandingPage as PrismaLandingPage } from '@prisma/client';
import { ItemImagenLanding } from '@entities/landing-page/item-imagen-landing.entity';
import { ItemColores } from '@entities/landing-page/item-colores.entity';

type LandingPageConRelaciones = Prisma.LandingPageGetPayload<{
  include: {
    itemColores: true;
    itemImagenesLanding: true;
  };
}>;

export interface LandingPageFactory {
  crearDesdePrisma(prisma: PrismaLandingPage): LandingPage;
  crearDesdePrismaConRelaciones(prisma: LandingPageConRelaciones): LandingPage;
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
      [],
      [],
    );
  }

  crearDesdePrismaConRelaciones(prisma: LandingPageConRelaciones): LandingPage {
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
      prisma.itemImagenesLanding.map(
        (img) => new ItemImagenLanding(
          img.id,
          img.imagenUrl
        )
      ),
      prisma.itemColores.map(
        (color) => new ItemColores(
          color.id,
          color.color
        )
      ),
    );
  }
}