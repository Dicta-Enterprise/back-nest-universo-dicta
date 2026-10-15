import { ProgresoCurso as PrismaProgresoCurso } from '@prisma/client';
import { ProgresoCurso } from 'src/core/entities/progreso-curso/progreso-curso.entity';

export interface ProgresoCursoFactory {
  crearDesdePrisma(prisma: PrismaProgresoCurso): ProgresoCurso;
}

export class DefaultProgresoCursoFactory implements ProgresoCursoFactory {
  crearDesdePrisma(prisma: PrismaProgresoCurso): ProgresoCurso {
    return new ProgresoCurso(
      prisma.id,
      prisma.idUsuario,
      prisma.idCuentaAsociada,
      prisma.idCurso,
      prisma.porcentaje,
      prisma.estado,
      prisma.fechaCompletado,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
    );
  }
}
