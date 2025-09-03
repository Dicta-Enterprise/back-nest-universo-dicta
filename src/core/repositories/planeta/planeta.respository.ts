import { EstadoGenerico } from '@prisma/client';
import { PlanetaPaginationDto } from 'src/application/dto/planeta/PlanetaPagination.dto';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';

export interface PlanetaRepository {
  findById(id: string): Promise<Planeta | null>;
  findByName(nombre: string): Promise<Planeta | null>;
  findAllActive(planetaPaginationDto: PlanetaPaginationDto): Promise<Planeta[]>;
  save(planeta: Planeta): Promise<Planeta>;
  update(id: string, planeta: Partial<Planeta>): Promise<Planeta>;
  delete(id: string, estado: EstadoGenerico): Promise<Planeta>;
}
