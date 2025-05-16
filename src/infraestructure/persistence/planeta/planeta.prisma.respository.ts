import { Injectable } from '@nestjs/common';
import { EstadoGenerico } from '@prisma/client';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetaRepository } from 'src/core/repositories/planeta/planeta.respository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class PlanetaPrismaRepository implements PlanetaRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Planeta | null> {
    const data = await this.prisma.planeta.findUnique({
      where: { id },
    });

    return data ? Planeta.fromPrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Planeta | null> {
    const data = await this.prisma.planeta.findUnique({
      where: { nombre },
    });

    return data ? Planeta.fromPrisma(data) : null;
  }

  async save(planeta: Planeta): Promise<Planeta> {
    const data = await this.prisma.planeta.create({
      data: {
        nombre: planeta.nombre,
        descripcion: planeta.descripcion,
        imagen: planeta.imagen, 
        estado: EstadoGenerico.ACTIVO,
      },
    });

    return Planeta.fromPrisma(data);
  }

  async findAllActive(): Promise<Planeta[]> {
    const planetas = await this.prisma.planeta.findMany({
      where: {
        estado: 'ACTIVO',
      },
    });

    const res = Planeta.fromPrismaList(planetas);

    return res;
  }

  async update(id: string, planeta: Partial<Planeta>): Promise<Planeta> {
    const data = await this.prisma.planeta.update({
      where: { id },
      data: {
        nombre: planeta.nombre,
        descripcion: planeta.descripcion,
        imagen: planeta.imagen, 
        estado: EstadoGenerico.ACTIVO,
      },
    });
    return Planeta.fromPrisma(data);
  }

  async delete(id: string, estado: EstadoGenerico): Promise<Planeta> {
    const data = await this.prisma.planeta.update({
      where: { id },
      data: {
        estado: estado,
      },
    });

    return Planeta.fromPrisma(data);
  }
}