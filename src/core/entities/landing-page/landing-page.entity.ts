// src/core/entities/landing-page.entity.ts

import { LandingPage as LandingPagePrisma } from '@prisma/client';
import { ItemImagenLanding } from './item-imagen-landing.entity';
import { ItemColores } from './item-colores.entity';
export class LandingPage {
  constructor(
    public id: string,
    public titulo: string,
    public descripcion: string,
    public imagenPrincipal: string,
    public contenido: string[],
    public estado: boolean,
    public slug: string,
    public metaKeywords: string,
    public landingUrl: string,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public itemImagenesLanding: ItemImagenLanding[],
    public itemColores: ItemColores[],
  ) {}

  static fromPrismaList(data: LandingPagePrisma[]): LandingPage[] {
    return data.map((item) => LandingPage.fromPrisma(item));
  }

  static fromPrisma(data: LandingPagePrisma): LandingPage {
    return new LandingPage(
      data.id,
      data.titulo,
      data.descripcion,
      data.imagenPrincipal,
      data.contenido,
      data.estado,
      data.slug,
      data.metaKeywords,
      data.landingUrl,
      data.fechaCreacion,
      data.fechaActualizacion,
      [],
      [],
    );
  }
}
