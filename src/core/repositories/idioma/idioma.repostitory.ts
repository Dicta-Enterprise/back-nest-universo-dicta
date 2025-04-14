import { Estandar } from "src/core/entities/estandar/estandar.entity";



export interface IdiomaRepository {
      findById(id: string): Promise<Estandar | null>;
      findByName(nombre: string): Promise<Estandar | null>;
      findAllActive(): Promise<Estandar[]>;
      save(idioma: Estandar): Promise<Estandar>;
      update(id: string, idioma: Partial<Estandar>): Promise<Estandar>;
      delete(id: string, estado: Estandar): Promise<Estandar>;
}