import { Idioma } from 'src/core/entities/idioma/idioma.entity';

export interface IdiomaRepository {
  findById(id: string): Promise<Idioma | null>;
  findByName(nombre: string): Promise<Idioma | null>;
  findAllActive(): Promise<Idioma[]>;
  save(idioma: Idioma): Promise<Idioma>;
  update(id: string, idioma: Partial<Idioma>): Promise<Idioma>;
  delete(id: string, estado: boolean): Promise<Idioma>;
}
