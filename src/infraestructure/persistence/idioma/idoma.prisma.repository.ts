import { Injectable } from '@nestjs/common';
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { IdiomaRepository } from 'src/core/repositories/idioma/idioma.repostitory';

@Injectable()
export class IdiomaPrismaRepository implements IdiomaRepository {
  findById(id: string): Promise<Idioma | null> {
    console.log('id', id);
    throw new Error('Method not implemented.');
  }
  findByName(nombre: string): Promise<Idioma | null> {
    console.log('nombre', nombre);
    throw new Error('Method not implemented.');
  }
  findAllActive(): Promise<Idioma[]> {
    throw new Error('Method not implemented.');
  }
  save(idioma: Idioma): Promise<Idioma> {
    console.log('idioma', idioma);
    throw new Error('Method not implemented.');
  }
  update(id: string, idioma: Partial<Idioma>): Promise<Idioma> {
    console.log('idioma', idioma);
    throw new Error('Method not implemented.');
  }
  delete(id: string, estado: boolean): Promise<Idioma> {
    console.log('id', id, estado);
    throw new Error('Method not implemented.');
  }
}
