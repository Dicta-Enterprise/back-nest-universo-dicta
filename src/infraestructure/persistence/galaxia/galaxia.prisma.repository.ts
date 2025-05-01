import { Injectable } from '@nestjs/common';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
// import { ObjectId } from 'mongodb';
@Injectable()
export class GalaxiaPrismaRepository implements GalaxiaRepository {
  constructor(private prisma: PrismaService) {}

  async save(galaxia: Galaxia, categoriaIds: string[]): Promise<Galaxia> {
    //const idFormated = categoriaIds.map((id) => new ObjectId(id));

    const data = await this.prisma.galaxia.create({
      data: {
        nombre: galaxia.nombre,
        descripcion: galaxia.descripcion,
        imagen: galaxia.imagen,
        estado: galaxia.estado,
        categorias: {
          connect: categoriaIds.map((id) => ({ id })),
        },
      },
      include: {
        categorias: true,
      },
    });

    return Galaxia.fromPrisma(data);
  }

  async findById(id: string): Promise<Galaxia | null> {
    const data = await this.prisma.galaxia.findUnique({
          where: { id },
        });
    
        return data ? Galaxia.fromPrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Galaxia | null> {
    const data = await this.prisma.galaxia.findUnique({
      where: { nombre },
    });

    return data ? Galaxia.fromPrisma(data) : null;
  }

  async findAllActive(): Promise<Galaxia[]> {
    const galaxias = await this.prisma.galaxia.findMany({
      where: {
        estado: true,
      },
      include: {
        categorias: true,
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
    });

    const res = Galaxia.fromPrismaList(galaxias);
    return res;
  }

  update(id: string, galaxia: Partial<Galaxia>): Promise<Galaxia> {
    console.log(id, galaxia);
    throw new Error('Method not implemented.');
  }
  async delete(id: string, estado: boolean): Promise<Galaxia> {
   const data = await this.prisma.galaxia.update({
         where: { id },
         data: {
           estado: estado,
         },
       });
   
       return Galaxia.fromPrisma(data);
  }
}
