import { LandingPage } from '@entities/landing-page/landing-page.entity';
import { Prisma, LandingPage as PrismaLandingPage } from '@prisma/client';
import { ItemImagenLanding } from '@entities/landing-page/item-imagen-landing.entity';
import { ItemColores } from '@entities/landing-page/item-colores.entity';

export type LandingPageConRelaciones = Prisma.LandingPageGetPayload<{
  include: {
    itemColores: true;
    itemImagenesLanding: true;
    planeta: {
      include: {
        galaxia: {
          include: {
            categoria: true;
          };
        };
      };
    };
  };
}>;

export interface LandingPageFactory {
  crearDesdePrisma(prisma: PrismaLandingPage): LandingPage;
  crearDesdePrismaConRelaciones(prisma: LandingPageConRelaciones): LandingPage;
}

export class DefaultLandingPageFactory implements LandingPageFactory {
  crearDesdePrisma(prisma: PrismaLandingPage): LandingPage {
    const raw = prisma as unknown as {
      secciones: Record<string, unknown> | null;
      seo: Record<string, unknown> | null;
      planetaId: string | null;
    };
    return new LandingPage(
      prisma.id,
      prisma.titulo,
      prisma.descripcion,
      prisma.imagenPrincipal,
      prisma.estado,
      prisma.slug,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
      [],
      [],
      raw.secciones ? raw.secciones : null,
      raw.seo ? raw.seo : null,
      raw.planetaId,
    );
  }

  crearDesdePrismaConRelaciones(prisma: LandingPageConRelaciones): LandingPage {
    const raw = prisma as unknown as {
      secciones: Record<string, unknown> | null;
      seo: Record<string, unknown> | null;
      planetaId: string | null;
    };
    return new LandingPage(
      prisma.id,
      prisma.titulo,
      prisma.descripcion,
      prisma.imagenPrincipal,
      prisma.estado,
      prisma.slug,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
      prisma.itemImagenesLanding.map(
        (img) => new ItemImagenLanding(img.id, img.imagenUrl),
      ),
      prisma.itemColores.map((color) => new ItemColores(color.id, color.color)),
      raw.secciones ? raw.secciones : null,
      raw.seo ? raw.seo : null,
      raw.planetaId,
    );
  }
}
