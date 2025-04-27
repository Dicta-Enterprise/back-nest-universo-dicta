import { Injectable } from '@nestjs/common';
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { IdiomaRepository } from 'src/core/repositories/idioma/idioma.repostitory';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class IdiomaPrismaRepository implements IdiomaRepository {

  constructor(private prisma: PrismaService) {}

  findById(id: string): Promise<Idioma | null> {
    console.log('id', id);
    throw new Error('Method not implemented.');
  }



  async findByName(nombre: string): Promise<Idioma | null> {
    const data = await this.prisma.idioma.findUnique({
      where: { nombre },
    })

    return data ? Idioma.fromPrisma(data) : null;
  }


  findAllActive(): Promise<Idioma[]> {
    throw new Error('Method not implemented.');
  }

  
  async save(idioma: Idioma): Promise<Idioma> {
    
    const data = await this.prisma.idioma.create({
      data: {
        nombre: idioma.nombre,
        estado: idioma.estado,
      },
    })

    return Idioma.fromPrisma(data);
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
