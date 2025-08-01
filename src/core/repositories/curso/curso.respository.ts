
import { Curso } from 'src/core/entities/curso/curso.entity';

export interface CursoRepository {
  findById(id: string): Promise<Curso | null>;
  findByName(nombre: string): Promise<Curso | null>;
  findAllActive(): Promise<Curso[]>;
  save(curso: Curso): Promise<Curso>;
  update(id: string, curso: Partial<Curso>): Promise<Curso>;
  delete(id: string, estado: boolean): Promise<Curso>;
}
