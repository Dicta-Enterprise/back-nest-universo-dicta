import { GALAXIA_FACTORY } from '@constants/factories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GalaxiaPaginationDto } from 'src/application/dto/galaxia';

import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaFactory } from 'src/core/fabricas/galaxia/galaxia.factory';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class GalaxiaPrismaRepository implements GalaxiaRepository {
  constructor(
    private prisma: PrismaService,
    @Inject(GALAXIA_FACTORY)
    private readonly galaxiaFactory: GalaxiaFactory,
  ) {}

  async save(galaxia: Galaxia): Promise<Galaxia> {
    const createData: Prisma.GalaxiaCreateInput = {
      nombre: galaxia.nombre,
      descripcion: galaxia.descripcion,
      tema: galaxia.tema,
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

    return this.galaxiaFactory.crearDesdePrisma(data);
  }
  async saveMultiple(galaxias: Galaxia[]): Promise<Galaxia[]> {
    return await this.prisma.$transaction(async (prisma) => {
      const results: Galaxia[] = [];

      for (const galaxia of galaxias) {
        const createData: Prisma.GalaxiaCreateInput = {
          nombre: galaxia.nombre,
          descripcion: galaxia.descripcion,
          tema: galaxia.tema,
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

        const data = await prisma.galaxia.create({
          data: createData,
          include: { categoria: true },
        });

        results.push(this.galaxiaFactory.crearDesdePrisma(data));
      }

      return results;
    });
  }
  async findAllActive(
    galaxiaPaginationDto: GalaxiaPaginationDto,
  ): Promise<Galaxia[]> {
    const { page, limit, categoriaId } = galaxiaPaginationDto;

    const galaxias = await this.prisma.galaxia.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { estado: true, ...(categoriaId && { categoriaId: categoriaId }) },
      include: {
        categoria: true,
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    if (!galaxias || galaxias.length === 0) {
      throw new NotFoundException(
        categoriaId
          ? `No existen galaxias activas en la categoría ${categoriaId}`
          : 'No existen galaxias activas',
      );
    }
    return galaxias.map((g) => this.galaxiaFactory.crearDesdePrisma(g));
  }

  async findById(id: string): Promise<Galaxia | null> {
    const data = await this.prisma.galaxia.findUnique({
      where: { id },
      include: { categoria: true },
    });

    return data ? this.galaxiaFactory.crearDesdePrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Galaxia | null> {
    const data = await this.prisma.galaxia.findFirst({
      where: { nombre },
      include: { categoria: true },
    });

    return data ? this.galaxiaFactory.crearDesdePrisma(data) : null;
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

    return this.galaxiaFactory.crearDesdePrisma(data);
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

    return this.galaxiaFactory.crearDesdePrisma(data);
  }

  async findByNombreYCategoria(
    nombre: string,
    categoriaId: string,
  ): Promise<Galaxia | null> {
    const galaxia = await this.prisma.galaxia.findFirst({
      where: { nombre, categoriaId },
      include: { categoria: true },
    });

    return galaxia ? this.galaxiaFactory.crearDesdePrisma(galaxia) : null;
  }

  async testConnection(): Promise<void> {
    await this.prisma.galaxia.count();
  }

  async findByCategoriaId(categoriaId: string): Promise<Galaxia[]> {
    const galaxiasPrisma = await this.prisma.galaxia.findMany({
      where: { categoriaId },
      include: { categoria: true },
    });

    return galaxiasPrisma.map((g) => this.galaxiaFactory.crearDesdePrisma(g));
  }

}