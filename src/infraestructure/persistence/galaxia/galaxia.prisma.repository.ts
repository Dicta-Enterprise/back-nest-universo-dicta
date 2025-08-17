import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class GalaxiaPrismaRepository implements GalaxiaRepository {
  constructor(private prisma: PrismaService) {}

  async save(galaxia: Galaxia): Promise<Galaxia> {
    const createData: Prisma.GalaxiaCreateInput = {
      nombre: galaxia.nombre,
      descripcion: galaxia.descripcion,
      imagen: galaxia.imagen,
      url: galaxia.url,
      textura: galaxia.textura,
      estado: galaxia.estado ?? true,
      fechaCreacion: galaxia.fechaCreacion ?? new Date(),
      fechaActualizacion: galaxia.fechaActualizacion ?? new Date(),
      categoria: {
        connect: { id: galaxia.categoriaId },
      },
      color: galaxia.color,
      posicion: galaxia.posicion
        ? {
            x: galaxia.posicion.x,
            y: galaxia.posicion.y,
            z: galaxia.posicion.z,
          }
        : undefined,
      rotacion: galaxia.rotacion
        ? {
            x: galaxia.rotacion.x,
            y: galaxia.rotacion.y,
            z: galaxia.rotacion.z,
          }
        : undefined,
    };

    const data = await this.prisma.galaxia.create({
      data: createData,
      include: { categoria: true },
    });

    return Galaxia.fromPrisma(data);
  }

  async findAllActive(): Promise<Galaxia[]> {
    const galaxias = await this.prisma.galaxia.findMany({
      where: { estado: true },
      include: { categoria: true },
      orderBy: { fechaCreacion: 'desc' },
    });

    return Galaxia.fromPrismaList(galaxias);
  }

  async findById(id: string): Promise<Galaxia | null> {
    const data = await this.prisma.galaxia.findUnique({
      where: { id },
      include: { categoria: true },
    });

    return data ? Galaxia.fromPrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Galaxia | null> {
    const data = await this.prisma.galaxia.findFirst({
      where: { nombre },
      include: { categoria: true },
    });

    return data ? Galaxia.fromPrisma(data) : null;
  }

  async update(id: string, galaxia: Partial<Galaxia>): Promise<Galaxia> {
    const updateData: Prisma.GalaxiaUpdateInput = {
      nombre: galaxia.nombre,
      descripcion: galaxia.descripcion,
      imagen: galaxia.imagen,
      url: galaxia.url,
      textura: galaxia.textura,
      estado: galaxia.estado,
      fechaActualizacion: new Date(),
      color: galaxia.color,
      posicion: galaxia.posicion
        ? {
            x: galaxia.posicion.x,
            y: galaxia.posicion.y,
            z: galaxia.posicion.z,
          }
        : undefined,
      rotacion: galaxia.rotacion
        ? {
            x: galaxia.rotacion.x,
            y: galaxia.rotacion.y,
            z: galaxia.rotacion.z,
          }
        : undefined,
    };

    if (galaxia.categoriaId) {
      updateData.categoria = { connect: { id: galaxia.categoriaId } };
    }

    const data = await this.prisma.galaxia.update({
      where: { id },
      data: updateData,
      include: { categoria: true },
    });

    return Galaxia.fromPrisma(data);
  }

  async delete(id: string, estado: boolean): Promise<Galaxia> {
    const data = await this.prisma.galaxia.update({
      where: { id },
      data: {
        estado,
        fechaActualizacion: new Date(),
      },
      include: { categoria: true },
    });

    return Galaxia.fromPrisma(data);
  }

  async findByNombreYCategoria(
    nombre: string,
    categoriaId: string,
  ): Promise<Galaxia | null> {
    const galaxia = await this.prisma.galaxia.findFirst({
      where: { nombre, categoriaId },
      include: { categoria: true },
    });

    return galaxia ? Galaxia.fromPrisma(galaxia) : null;
  }

  async testConnection(): Promise<void> {
    await this.prisma.galaxia.count();
  }
}
