// src/core/entities/landing-page.entity.ts

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
}
