import { Curso, CursoImagenes } from '@entities/curso/curso.entity';
import { Prisma, Curso as PrismaCurso } from '@prisma/client';
import { Profesor } from '@entities/profesor/profesor.entity';
import { Categoria } from '@entities/categoria/categoria.entity';
import { Beneficio } from '@entities/planeta/beneficio/beneficio.entity';

export type CursoConDataRelacionada = Prisma.CursoGetPayload<{
  include: {
    profesor: true;
    categoria: true;
    planeta: true;
  };
}>;

export interface CursoFactory {
  crearDesdePrisma(prisma: PrismaCurso): Curso;
  crearDesdePrismaConMasData(prisma: CursoConDataRelacionada): Curso;
}

export class DefaultCursoFactory implements CursoFactory {
  crearDesdePrisma(prisma: PrismaCurso): Curso {
    return new Curso(
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
    );
  }

  crearDesdePrismaConMasData(prisma: CursoConDataRelacionada): Curso {
    const curso = this.crearDesdePrisma(prisma);

    if (prisma.profesor) {
      curso.profesor = prisma.profesor as unknown as Profesor;
    }
    
    if (prisma.categoria) {
      curso.categoria = prisma.categoria as unknown as Categoria;
    }
    
    const datosExtesos = prisma as unknown as Record<string, unknown>;
    if (datosExtesos.beneficios && Array.isArray(datosExtesos.beneficios)) { 
      curso.beneficios = datosExtesos.beneficios as unknown as Beneficio[];
    }

    return curso;
  }
}