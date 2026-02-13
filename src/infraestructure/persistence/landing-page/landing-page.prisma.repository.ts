import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { LandingPageRepository } from 'src/core/repositories/landing-page/landing-page.repository';
import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';
import { LANDING_PAGE_FACTORY } from '@constants/factories';
import { LandingPageFactory } from 'src/core/fabricas/landing-page/landing-page.factory';

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
    return data ? this.landingPageFactory.crearDesdePrisma(data) : null;
  }

  async findById(id: string): Promise<LandingPage | null> {
    const data = await this.prisma.landingPage.findUnique({
      where: { id },
      include: {
        itemImagenesLanding: true,
        itemColores: true,
      },
    });

    return data? this.landingPageFactory.crearDesdePrismaConRelaciones(data): null;
  }

  async findBySlug(slug: string): Promise<LandingPage | null> {
    const data = await this.prisma.landingPage.findUnique({
      where: { slug },
    });

    return data ? this.landingPageFactory.crearDesdePrisma(data) : null;
  }

  async save(landingPage: LandingPage): Promise<LandingPage> {
    const data = await this.prisma.landingPage.create({
      data: {
        titulo: landingPage.titulo,
        descripcion: landingPage.descripcion,
        imagenPrincipal: landingPage.imagenPrincipal,
        contenido: landingPage.contenido,
        estado: landingPage.estado,
        slug: landingPage.slug,
        metaKeywords: landingPage.metaKeywords,
        landingUrl: landingPage.landingUrl,

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
      },
      include: {
        itemImagenesLanding: true,
        itemColores: true,
      },
    });

    return this.landingPageFactory.crearDesdePrismaConRelaciones(data);
  }

  async findAllActive(): Promise<LandingPage[]> {
    const landingPages = await this.prisma.landingPage.findMany({
      where: {
        estado: true,
      },
      include: {
        itemImagenesLanding: true,
        itemColores: true,
      },
    });

    return landingPages.map((lp) =>
      this.landingPageFactory.crearDesdePrismaConRelaciones(lp),
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
        contenido: landingPage.contenido,
        estado: landingPage.estado,
        slug: landingPage.slug,
        metaKeywords: landingPage.metaKeywords,
        landingUrl: landingPage.landingUrl,
      },
    });

    return this.landingPageFactory.crearDesdePrisma(data);
  }

  async delete(id: string, estado: boolean): Promise<LandingPage> {
    const data = await this.prisma.landingPage.update({
      where: { id },
      data: {
        estado: estado,
      },
    });

    return this.landingPageFactory.crearDesdePrisma(data);
  }
}
