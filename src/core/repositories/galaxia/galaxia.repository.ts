import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';

export interface GalaxiaRepository {
  findById(id: string): Promise<Galaxia | null>;
  findByName(nombre: string): Promise<Galaxia | null>;
  findAllActive(): Promise<Galaxia[]>;
  save(galaxia: Galaxia, categoriaId:string[]): Promise<Galaxia>;
  update(id: string, galaxia: Partial<Galaxia>): Promise<Galaxia>;
  delete(id: string, estado: Galaxia): Promise<Galaxia>;
}
