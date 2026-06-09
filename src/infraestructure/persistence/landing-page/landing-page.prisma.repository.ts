import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { LandingPageFilters, LandingPageRepository } from 'src/core/repositories/landing-page/landing-page.repository';
import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';
import { LANDING_PAGE_FACTORY } from '@constants/factories';
import { LandingPageConRelaciones, LandingPageFactory } from 'src/core/fabricas/landing-page/landing-page.factory';
import { Prisma, LandingPage as PrismaLandingPage } from '@prisma/client';

const landingPageInclude = {
  itemImagenesLanding: true,
  itemColores: true,
  planeta: {
    include: {
      galaxia: {
        include: {
          categoria: true,
        },
      },
    },
  },
};

@Injectable()
export class LandingPagePrismaRepository implements LandingPageRepository {
  constructor(
    private prisma: PrismaService,
    @Inject(LANDING_PAGE_FACTORY)
    private readonly landingPageFactory: LandingPageFactory,
  ) {}

  async findByTitulo(titulo: string): Promise<LandingPage | null> {
    const data = await this.prisma.landingPage.findFirst({
      where: { titulo },
    });
    return data ? this.landingPageFactory.crearDesdePrisma(data as unknown as PrismaLandingPage) : null;
  }

  async findById(id: string): Promise<LandingPage | null> {
    const data = await this.prisma.landingPage.findFirst({
      where: { id },
      include: landingPageInclude,
    });

    return data ? this.landingPageFactory.crearDesdePrismaConRelaciones(data as unknown as LandingPageConRelaciones) : null;
  }

  async findBySlug(slug: string): Promise<LandingPage | null> {
    const data = await this.prisma.landingPage.findFirst({
      where: { slug },
    });

    return data ? this.landingPageFactory.crearDesdePrisma(data as unknown as PrismaLandingPage) : null;
  }

  async save(landingPage: LandingPage): Promise<LandingPage> {
    const data = await this.prisma.landingPage.create({
      data: {
        titulo: landingPage.titulo,
        descripcion: landingPage.descripcion,
        imagenPrincipal: landingPage.imagenPrincipal,
        estado: landingPage.estado,
        slug: landingPage.slug,
        secciones: landingPage.secciones ? (landingPage.secciones as Prisma.InputJsonValue) : undefined,
        seo: landingPage.seo ? (landingPage.seo as Prisma.InputJsonValue) : undefined,
        planetaId: landingPage.planetaId,

        itemImagenesLanding: {
          create: landingPage.itemImagenesLanding.map((img) => ({
            imagenUrl: img.imagenUrl,
          })),
        },

        itemColores: {
          create: landingPage.itemColores.map((color) => ({
            color: color.color,
          })),
        },
      } as unknown as Prisma.LandingPageCreateInput,
      include: landingPageInclude,
    });

    return this.landingPageFactory.crearDesdePrismaConRelaciones(data as unknown as LandingPageConRelaciones);
  }

  async findAll(filters?: LandingPageFilters): Promise<LandingPage[]> {
    const where: Record<string, unknown> = {};

    if (filters?.planetaId) {
      where.planetaId = filters.planetaId;
    } else if (filters?.galaxiaId) {
      where.planeta = {
        galaxiaId: filters.galaxiaId,
      };
    } else if (filters?.categoriaId) {
      where.planeta = {
        galaxia: {
          categoriaId: filters.categoriaId,
        },
      };
    }

    const landingPages = await this.prisma.landingPage.findMany({
      where: where as unknown as Prisma.LandingPageWhereInput,
      include: landingPageInclude,
    });

    return landingPages.map((lp) =>
      this.landingPageFactory.crearDesdePrismaConRelaciones(lp as unknown as LandingPageConRelaciones),
    );
  }

  async update(
    id: string,
    landingPage: Partial<LandingPage>,
  ): Promise<LandingPage> {
    const data = await this.prisma.landingPage.update({
      where: { id },
      data: {
        titulo: landingPage.titulo,
        descripcion: landingPage.descripcion,
        imagenPrincipal: landingPage.imagenPrincipal,
        estado: landingPage.estado,
        slug: landingPage.slug,
        secciones: landingPage.secciones !== undefined ? (landingPage.secciones as Prisma.InputJsonValue) : undefined,
        seo: landingPage.seo !== undefined ? (landingPage.seo as Prisma.InputJsonValue) : undefined,
        planetaId: landingPage.planetaId !== undefined ? landingPage.planetaId : undefined,
      } as unknown as Prisma.LandingPageUpdateInput,
      include: landingPageInclude,
    });

    return this.landingPageFactory.crearDesdePrismaConRelaciones(data as unknown as LandingPageConRelaciones);
  }

  async delete(id: string, estado: boolean): Promise<LandingPage> {
    const data = await this.prisma.landingPage.update({
      where: { id },
      data: {
        estado: estado,
      },
    });

    return this.landingPageFactory.crearDesdePrisma(data as unknown as PrismaLandingPage);
  }
}
