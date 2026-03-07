import { GalaxiaPaginationDto } from 'src/application/dto/galaxia';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';

export interface GalaxiaRepository {
  findById(id: string): Promise<Galaxia | null>;
  findByName(nombre: string): Promise<Galaxia | null>;
  findAllActive(galaxiaPaginationDto:GalaxiaPaginationDto): Promise<Galaxia[]>;
  save(galaxia: Galaxia): Promise<Galaxia>;
  saveMultiple(galaxias: Galaxia[]): Promise<Galaxia[]>;
  update(id: string, galaxia: Partial<Galaxia>): Promise<Galaxia>;
  delete(id: string, estado: boolean): Promise<Galaxia>;
  findByNombreYCategoria(
    nombre: string,
    categoriaId: string,
  ): Promise<Galaxia>;
  findByCategoriaId(categoriaId: string): Promise<Galaxia[]>;
}
