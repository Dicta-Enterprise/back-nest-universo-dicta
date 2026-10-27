import { PLANTILLA_CERTIFICACION_FACTORY } from '@constants/factories';
import { Inject, Injectable } from '@nestjs/common';
import { EstadoPlantilla, Prisma, TipoCertificacion } from '@prisma/client';
import { PlantillaCertificacion } from 'src/core/entities/plantilla-certificacion/plantilla-certificacion.entity';
import { PlantillaCertificacionFactory } from 'src/core/fabricas/plantilla-certificacion/plantilla-certificacion.factory';
import {
  FiltrosPlantillaCertificacion,
  PlantillaCertificacionRepository,
} from 'src/core/repositories/plantilla-certificacion/plantilla-certificacion.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { ValidationError } from 'src/shared/domain/errors/validation.error';

@Injectable()
export class PlantillaCertificacionPrismaRepository
  implements PlantillaCertificacionRepository
{
  constructor(
    private prisma: PrismaService,
    @Inject(PLANTILLA_CERTIFICACION_FACTORY)
    private readonly plantillaFactory: PlantillaCertificacionFactory,
  ) {}

  async findById(id: string): Promise<PlantillaCertificacion | null> {
    const data = await this.prisma.plantillaCertificacion.findUnique({
      where: { id },
    });
    return data ? this.plantillaFactory.crearDesdePrisma(data) : null;
  }

  async findActivaByNombre(
    nombre: string,
    excludeId?: string,
  ): Promise<PlantillaCertificacion | null> {
    const data = await this.prisma.plantillaCertificacion.findFirst({
      where: {
        nombre,
        estado: EstadoPlantilla.ACTIVA,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return data ? this.plantillaFactory.crearDesdePrisma(data) : null;
  }

  async findActivaByTipo(
    tipo: TipoCertificacion,
    excludeId?: string,
  ): Promise<PlantillaCertificacion | null> {
    const data = await this.prisma.plantillaCertificacion.findFirst({
      where: {
        tipoCertificacion: tipo,
        estado: EstadoPlantilla.ACTIVA,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return data ? this.plantillaFactory.crearDesdePrisma(data) : null;
  }

  async findAll(
    filtros?: FiltrosPlantillaCertificacion,
  ): Promise<PlantillaCertificacion[]> {
    const data = await this.prisma.plantillaCertificacion.findMany({
      where: {
        ...(filtros?.estado && { estado: filtros.estado }),
        ...(filtros?.tipoCertificacion && {
          tipoCertificacion: filtros.tipoCertificacion,
        }),
      },
    });
    return data.map((p) => this.plantillaFactory.crearDesdePrisma(p));
  }

  async save(
    plantilla: PlantillaCertificacion,
  ): Promise<PlantillaCertificacion> {
    try {
      const data = await this.prisma.plantillaCertificacion.create({
        data: {
          nombre: plantilla.nombre,
          descripcion: plantilla.descripcion,
          tipoCertificacion: plantilla.tipoCertificacion,
          urlPlantilla: plantilla.urlPlantilla,
          configuracion: plantilla.configuracion as unknown as Prisma.InputJsonValue,
          estado: plantilla.estado,
        },
      });
      return this.plantillaFactory.crearDesdePrisma(data);
    } catch {
      throw new ValidationError('Error al registrar la plantilla de certificación');
    }
  }

  async update(
    id: string,
    plantilla: Partial<PlantillaCertificacion>,
  ): Promise<PlantillaCertificacion> {
    try {
      const data = await this.prisma.plantillaCertificacion.update({
        where: { id },
        data: {
          nombre: plantilla.nombre,
          descripcion: plantilla.descripcion,
          tipoCertificacion: plantilla.tipoCertificacion,
          urlPlantilla: plantilla.urlPlantilla,
          configuracion: plantilla.configuracion as unknown as Prisma.InputJsonValue,
          estado: plantilla.estado,
        },
      });
      return this.plantillaFactory.crearDesdePrisma(data);
    } catch {
      throw new ValidationError('La plantilla no existe o no se pudo actualizar');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.plantillaCertificacion.delete({ where: { id } });
    } catch {
      throw new ValidationError('La plantilla no existe o no se pudo eliminar');
    }
  }

  async tieneCertificacionesAsociadas(id: string): Promise<boolean> {
    const count = await this.prisma.certificacion.count({
      where: { idPlantilla: id },
    });
    return count > 0;
  }
}
