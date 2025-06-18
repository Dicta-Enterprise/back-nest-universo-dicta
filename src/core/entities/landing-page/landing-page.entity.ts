// src/core/entities/landing-page.entity.ts

import { ItemImagenLanding } from "./item-imagen-landing.entity";
import { ItemColores } from "./item-colores.entity";
import { Schema, Document } from 'mongoose';

// Definición del esquema de Mongoose para LandingPage
export const LandingPageSchema = new Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  imagenPrincipal: { type: String },
  contenido: [{ type: String }],
  estado: { type: Boolean, default: true },
  slug: { type: String },
  metaKeywords: { type: String },
  landingUrl: { type: String },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now },
});

// Interfaz para tipar los documentos de LandingPage en MongoDB
export interface LandingPageDocument extends Document {
  id: string;
  titulo: string;
  descripcion: string;
  imagenPrincipal: string;
  contenido: string[];
  estado: boolean;
  slug: string;
  metaKeywords: string;
  landingUrl: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  itemImagenesLanding: ItemImagenLanding[];
  itemColores: ItemColores[];
}


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

  static fromPrisma(data: any): LandingPage {
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
      data.itemImagenesLanding ? data.itemImagenesLanding.map((i: any) => ItemImagenLanding.fromPrisma(i)) : [],
      data.itemColores ? data.itemColores.map((i: any) => ItemColores.fromPrisma(i)) : [],
    );
  }

  static fromPrismaList(data: any[]): LandingPage[] {
    return data.map(item => LandingPage.fromPrisma(item));
  }
}
