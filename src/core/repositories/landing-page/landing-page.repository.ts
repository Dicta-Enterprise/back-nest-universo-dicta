import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';

export interface LandingPageFilters {
  planetaId?: string;
  galaxiaId?: string;
  categoriaId?: string;
}

export interface LandingPageRepository {
  findById(id: string): Promise<LandingPage | null>;
  findByTitulo(titulo: string): Promise<LandingPage | null>;
  findAll(filters?: LandingPageFilters): Promise<LandingPage[]>;
  save(landingPage: LandingPage): Promise<LandingPage>;
  update(id: string, landingPage: Partial<LandingPage>): Promise<LandingPage>;
  delete(id: string, estado: boolean): Promise<LandingPage>;
  findBySlug(slug: string): Promise<LandingPage | null>;
}
