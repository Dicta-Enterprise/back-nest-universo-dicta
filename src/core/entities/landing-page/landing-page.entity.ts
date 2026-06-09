import { ItemImagenLanding } from './item-imagen-landing.entity';
import { ItemColores } from './item-colores.entity';

export class LandingPage {
  constructor(
    public id: string,
    public titulo: string,
    public descripcion: string,
    public imagenPrincipal: string,
    public estado: boolean,
    public slug: string,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public itemImagenesLanding: ItemImagenLanding[],
    public itemColores: ItemColores[],
    public secciones?: Record<string, unknown> | null,
    public seo?: Record<string, unknown> | null,
    public planetaId?: string | null,
  ) {}
}
