import { Injectable } from '@nestjs/common';
import { ProgresoModulo as ProgresoPrisma } from '@prisma/client';
import { ProgresoModulo } from 'src/core/entities/progreso-modulo/progreso-modulo.entity';
import { ProgresoModuloRepository } from 'src/core/repositories/progreso-modulo/progreso-modulo.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class ProgresoModuloPrismaRepository implements ProgresoModuloRepository {
  constructor(private prisma: PrismaService) {}

  async find(usuarioId: number, cursoId: string, moduloId: string): Promise<ProgresoModulo | null> {
    const data = await this.prisma.progresoModulo.findUnique({
      where: { usuarioId_cursoId_moduloId: { usuarioId, cursoId, moduloId } },
    });
    return data ? this.aEntidad(data) : null;
  }

  async findByUsuarios(usuarioIds: number[]): Promise<ProgresoModulo[]> {
    if (usuarioIds.length === 0) {
      return [];
    }
    const data = await this.prisma.progresoModulo.findMany({
      where: { usuarioId: { in: usuarioIds } },
    });
    return data.map((d) => this.aEntidad(d));
  }

  async upsert(progreso: ProgresoModulo): Promise<ProgresoModulo> {
    const datos = {
      estado: progreso.estado,
      porcentajeVideo: progreso.porcentajeVideo,
      quizPuntaje: progreso.quizPuntaje,
      quizTotal: progreso.quizTotal,
      quizAprobado: progreso.quizAprobado,
      pistasUsadas: progreso.pistasUsadas,
      eventosProcesados: progreso.eventosProcesados,
      ultimaActividad: progreso.ultimaActividad,
      completadoEn: progreso.completadoEn,
    };

    const data = await this.prisma.progresoModulo.upsert({
      where: {
        usuarioId_cursoId_moduloId: {
          usuarioId: progreso.usuarioId,
          cursoId: progreso.cursoId,
          moduloId: progreso.moduloId,
        },
      },
      create: {
        usuarioId: progreso.usuarioId,
        cursoId: progreso.cursoId,
        moduloId: progreso.moduloId,
        ...datos,
      },
      update: datos,
    });
    return this.aEntidad(data);
  }

  private aEntidad(data: ProgresoPrisma): ProgresoModulo {
    return new ProgresoModulo(
      data.usuarioId,
      data.cursoId,
      data.moduloId,
      data.estado,
      data.porcentajeVideo,
      data.pistasUsadas,
      data.eventosProcesados,
      data.ultimaActividad,
      data.quizPuntaje,
      data.quizTotal,
      data.quizAprobado,
      data.completadoEn,
      data.id,
    );
  }
}
