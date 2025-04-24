import { Injectable } from '@nestjs/common';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class GalaxiaPrismaRepository implements GalaxiaRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: string): Promise<Galaxia | null> {
    console.log(id);
    throw new Error('Method not implementedddddddd.');
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
        estado: 'ACTIVO',
      },
    });

    const res = Galaxia.fromPrismaList(galaxias);
    return res;
  }

  async save(galaxia: Galaxia): Promise<Galaxia> {
    const data = await this.prisma.galaxia.create({
      data: {
        nombre: galaxia.nombre,
        descripcion: galaxia.descripcion,
        imagen: galaxia.imagen,
        estado: galaxia.estado,
        fechaCreacion: galaxia.fechaCreacion,
        fechaActualizacion: galaxia.fechaActualizacion,
      },
    });

    return Galaxia.fromPrisma(data);
  }

  update(id: string, galaxia: Partial<Galaxia>): Promise<Galaxia> {
    console.log(id, galaxia);
    throw new Error('Method not implemented.');
  }
  delete(id: string, estado: Galaxia): Promise<Galaxia> {
    console.log(id, estado);
    throw new Error('Method not implemented.');
  }
}
