import { Curso } from '@entities/curso/curso.entity';
import { Prisma, Curso as PrismaCurso } from '@prisma/client';

type CursoConRelaciones = Prisma.CursoGetPayload<{
  include: {
    profesor: {
      select: {
        id: true;
        nombre: true;
        dni: true;
        apellido_materno: true;
        apellido_paterno: true;
        estado_p: true;
        email: true;
        cursos: true;
      };
    };
    categoria: {
      select: {
        id: true;
        nombre: true;
        descripcion: true;
        url: true;
        estado: true;
      };
    };
    planeta: {
      select: {
        id: true;
        nombre: true;
        descripcion: true;
        url: true;
        estado: true;
      };
    };
  };
}>;

export interface CursoFactory {
  crearDesdePrisma(prisma: PrismaCurso): Curso;
  crearDesdePrismaConMasData(prisma: CursoConRelaciones): Curso;
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
      prisma.resumenDescripcion ?? undefined,
      prisma.valoracion ?? undefined,
      prisma.planetaId ?? undefined,
      undefined,           
      undefined,           
      undefined,           
      prisma.beneficios,   
    );
  }

  
crearDesdePrismaConMasData(prisma: PrismaCurso): Curso {
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
    prisma.resumenDescripcion ?? undefined,
    prisma.valoracion ?? undefined,
    prisma.planetaId ?? undefined,

    undefined, // profesor
    undefined, // categoria
    undefined, // planeta

    prisma.beneficios,
  );
}
}