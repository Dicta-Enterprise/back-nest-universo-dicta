import { Curso, CursoImagenes } from '@entities/curso/curso.entity';
import { Prisma, Curso as PrismaCurso } from '@prisma/client';
import { Profesor } from '@entities/profesor/profesor.entity';
import { Categoria } from '@entities/categoria/categoria.entity';
import { Beneficio } from '@entities/planeta/beneficio/beneficio.entity';

export type CursoConDataRelacionada = Prisma.CursoGetPayload<{
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

type CursoConRelaciones = CursoConDataRelacionada;

export interface CursoFactory {
  crearDesdePrisma(prisma: PrismaCurso): Curso;
  crearDesdePrismaConMasData(prisma: CursoConRelaciones): Curso;
}

interface ConstructorCursoDinamico {
  new (...args: unknown[]): Curso;
}

export class DefaultCursoFactory implements CursoFactory {

  crearDesdePrisma(prisma: PrismaCurso): Curso {
    const datosExtensos = prisma as unknown as Record<string, unknown>;
    const CursoInstanciable = Curso as unknown as ConstructorCursoDinamico;

    return new CursoInstanciable(
      prisma.id,
      prisma.nombre,
      prisma.descripcion,
      prisma.fechaCreacion,
      prisma.fechaInicio ?? new Date(),
      prisma.fechaFinal ?? new Date(),
      prisma.precio,
      prisma.estado,
      prisma.imagenes as unknown as CursoImagenes, 
      prisma.duracionSemanas ?? 0,
      prisma.profesorId ?? '',
      prisma.categoriaId ?? '',
      prisma.resumenDescripcion ?? '',
      prisma.valoracion ?? 0,
      datosExtensos.planetaId as string ?? undefined,
      undefined as unknown as Profesor, 
      datosExtensos.beneficios as Beneficio[] ?? undefined,
    );
  }

  crearDesdePrismaConMasData(prisma: CursoConRelaciones): Curso {
    const curso = this.crearDesdePrisma(prisma as unknown as PrismaCurso);

    if (prisma.profesor) {
      curso.profesor = prisma.profesor as unknown as Profesor;
    }
    
    if (prisma.categoria) {
      curso.categoria = prisma.categoria as unknown as Categoria;
    }
    
    const datosDinamicos = curso as unknown as Record<string, unknown>;
    const datosPlaneta = prisma as unknown as Record<string, unknown>;
    
    if (datosPlaneta.planeta && ('planeta' in curso)) {
      datosDinamicos.planeta = datosPlaneta.planeta;
    }

    if (datosPlaneta.beneficios && Array.isArray(datosPlaneta.beneficios)) { 
      curso.beneficios = datosPlaneta.beneficios as unknown as Beneficio[];
    }

    return curso;
  }
}