import { PROGRESO_CURSO_FACTORY } from '@constants/factories';
import { Inject, Injectable } from '@nestjs/common';
import { ProgresoCurso } from 'src/core/entities/progreso-curso/progreso-curso.entity';
import { ProgresoCursoFactory } from 'src/core/fabricas/progreso-curso/progreso-curso.factory';
import {
  DatosProgresoCurso,
  ProgresoCursoRepository,
} from 'src/core/repositories/progreso-curso/progreso-curso.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { ValidationError } from 'src/shared/domain/errors/validation.error';

@Injectable()
export class ProgresoCursoPrismaRepository implements ProgresoCursoRepository {
  constructor(
    private prisma: PrismaService,
    @Inject(PROGRESO_CURSO_FACTORY)
    private readonly factory: ProgresoCursoFactory,
  ) {}

  async findByTitularYCurso(
    idUsuario: number,
    idCuentaAsociada: number | null,
    idCurso: string,
  ): Promise<ProgresoCurso | null> {
    const data = await this.prisma.progresoCurso.findFirst({
      where: { idUsuario, idCuentaAsociada, idCurso },
    });
    return data ? this.factory.crearDesdePrisma(data) : null;
  }

  async findAllByUsuario(idUsuario: number): Promise<ProgresoCurso[]> {
    const data = await this.prisma.progresoCurso.findMany({
      where: { idUsuario },
      orderBy: { fechaActualizacion: 'desc' },
    });
    return data.map((p) => this.factory.crearDesdePrisma(p));
  }

  async findAllByCuentaAsociada(
    idCuentaAsociada: number,
  ): Promise<ProgresoCurso[]> {
    const data = await this.prisma.progresoCurso.findMany({
      where: { idCuentaAsociada },
      orderBy: { fechaActualizacion: 'desc' },
    });
    return data.map((p) => this.factory.crearDesdePrisma(p));
  }

  async guardar(datos: DatosProgresoCurso): Promise<ProgresoCurso> {
    try {
      const existente = await this.prisma.progresoCurso.findFirst({
        where: {
          idUsuario: datos.idUsuario,
          idCuentaAsociada: datos.idCuentaAsociada,
          idCurso: datos.idCurso,
        },
      });

      const data = existente
        ? await this.prisma.progresoCurso.update({
            where: { id: existente.id },
            data: {
              porcentaje: datos.porcentaje,
              estado: datos.estado,
              fechaCompletado: datos.fechaCompletado,
            },
          })
        : await this.prisma.progresoCurso.create({
            data: {
              idUsuario: datos.idUsuario,
              idCuentaAsociada: datos.idCuentaAsociada,
              idCurso: datos.idCurso,
              porcentaje: datos.porcentaje,
              estado: datos.estado,
              fechaCompletado: datos.fechaCompletado,
            },
          });

      return this.factory.crearDesdePrisma(data);
    } catch {
      throw new ValidationError('Error al guardar el progreso del curso');
    }
  }
}
