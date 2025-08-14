import { EstadoGenerico } from '@prisma/client';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';

export interface PlanetaRepository {
  findById(id: string): Promise<Planeta | null>;
  findByName(nombre: string): Promise<Planeta | null>;
  findAllActive(): Promise<Planeta[]>;
  save(planeta: Planeta): Promise<Planeta>;
  update(id: string, planeta: Partial<Planeta>): Promise<Planeta>;
  delete(id: string, estado: EstadoGenerico): Promise<Planeta>;
}
