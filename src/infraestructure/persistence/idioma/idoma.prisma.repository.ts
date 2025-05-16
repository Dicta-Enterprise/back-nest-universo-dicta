import { Injectable } from '@nestjs/common';
import { Estandar } from 'src/core/entities/estandar/estandar.entity';
import { IdiomaRepository } from 'src/core/repositories/idioma/idioma.repostitory';

@Injectable()
export class IdiomaPrismaRepository implements IdiomaRepository {
  findById(id: string): Promise<Estandar | null> {
    console.log('id', id);
    throw new Error('Method not implemented.');
  }
  findByName(nombre: string): Promise<Estandar | null> {
    console.log('nombre', nombre);
    throw new Error('Method not implemented.');
  }
  findAllActive(): Promise<Estandar[]> {
    throw new Error('Method not implemented.');
  }
  save(idioma: Estandar): Promise<Estandar> {
    console.log('idioma', idioma);
    throw new Error('Method not implemented.');
  }
  update(id: string, idioma: Partial<Estandar>): Promise<Estandar> {
    console.log('idioma', idioma);
    throw new Error('Method not implemented.');
  }
  delete(id: string, estado: Estandar): Promise<Estandar> {
    console.log('id', id, estado);
    throw new Error('Method not implemented.');
  }
}
