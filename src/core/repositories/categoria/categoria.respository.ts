
import { Categoria } from 'src/core/entities/categoria/categoria.entity';

export interface CategoriaRepository {
  findById(id: string): Promise<Categoria | null>;
  findByName(nombre: string): Promise<Categoria | null>;
  findAllActive(): Promise<Categoria[]>;
  save(categoria: Categoria): Promise<Categoria>;
  update(id: string, categoria: Partial<Categoria>): Promise<Categoria>;
  delete(id: string, estado: boolean): Promise<Categoria>;
}
