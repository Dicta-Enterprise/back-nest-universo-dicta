// src/core/repositories/landing-page.repository.ts

import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';



export interface LandingPageRepository {
  findById(id: string): Promise<LandingPage | null>;
  findByTitulo(titulo: string): Promise<LandingPage | null>;
  findAll(): Promise<LandingPage[]>;
  save(landingPage: LandingPage): Promise<LandingPage>;
  update(id: string, landingPage: Partial<LandingPage>): Promise<LandingPage>;
  delete(id: string, estado: boolean): Promise<LandingPage>;
  findBySlug(slug: string): Promise<LandingPage | null>;
}