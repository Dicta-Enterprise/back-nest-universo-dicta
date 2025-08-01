import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { LandingPageRepository } from 'src/core/repositories/landing-page/landing-page.repository'; 
import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';


@Injectable()
export class LandingPagePrismaRepository implements LandingPageRepository {
  constructor(private prisma: PrismaService) {}
    
  async findByTitulo(titulo: string): Promise<LandingPage | null> {
    const data = await this.prisma.landingPage.findFirst({
      where: { titulo },
    });
    return data ? LandingPage.fromPrisma(data) : null;
  }

  
  async findById(id: string): Promise<LandingPage | null> {
    const data = await this.prisma.landingPage.findUnique({
      where: { id },
    });

    return data ? LandingPage.fromPrisma(data) : null;
  }

   
  async findBySlug(slug: string): Promise<LandingPage | null> {
    const data = await this.prisma.landingPage.findUnique({
      where: { slug },
    });

    return data ? LandingPage.fromPrisma(data) : null;
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
      },
    });

    return LandingPage.fromPrisma(data);
  }

  
  async findAllActive(): Promise<LandingPage[]> {
    const landingPages = await this.prisma.landingPage.findMany({
      where: {
        estado: true,
      },
    });

    return LandingPage.fromPrismaList(landingPages);
  }


  async update(id: string, landingPage: Partial<LandingPage>): Promise<LandingPage> {
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

    return LandingPage.fromPrisma(data);
  }

  
  async delete(id: string, estado: boolean): Promise<LandingPage> {
    const data = await this.prisma.landingPage.update({
      where: { id },
      data: {
        estado: estado,
      },
    });

    return LandingPage.fromPrisma(data);
  }
}
