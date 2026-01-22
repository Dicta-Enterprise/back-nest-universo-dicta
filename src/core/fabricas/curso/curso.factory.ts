import { Curso } from '@entities/curso/curso.entity';
import { Prisma, Curso as PrismaCurso } from '@prisma/client';

type CursoConPlaneta = Prisma.CursoGetPayload<{
  include: {
    profesor: {
      select: {
        id: true;
        nombre: true;
        dni: false;
        apellido_materno: true;
        apellido_paterno: true;
        estado_p: false;
        email: true;
      };
    };
    categoria: {
      select: {
        id: false;
        nombre: true;
        descripcion: true;
        url: false;
        estado: false;
      };
    };
  };
}>;

export interface CursoFactory {
  crearDesdePrisma(prisma: PrismaCurso): Curso;
  crearDesdePrismaConMasData(prisma: CursoConPlaneta): Curso;
}

export class DefaultCursoFactory implements CursoFactory {
  crearDesdePrisma(prisma: PrismaCurso): Curso {
    return new Curso(
      prisma.id,
      prisma.nombre,
      prisma.descripcion,
      prisma.fechaCreacion,
      prisma.fechaInicio,
      prisma.fechaFinal,
      prisma.precio,
      prisma.estado,
      prisma.imagen,
      prisma.duracionSemanas,
      prisma.profesorId,
      prisma.categoriaId,
    );
  }
  crearDesdePrismaConMasData(prisma: CursoConPlaneta): Curso {
    return new Curso(
      prisma.id,
      prisma.nombre,
      prisma.descripcion,
      prisma.fechaCreacion,
      prisma.fechaInicio,
      prisma.fechaFinal,
      prisma.precio,
      prisma.estado,
      prisma.imagen,
      prisma.duracionSemanas,
      prisma.profesorId,
      prisma.categoriaId,
    );
  }
}
