import { Categoria } from '../categoria/categoria.entity';
import { Profesor } from '../profesor/profesor.entity';
import { Planeta } from '../planeta/planeta.entity';

// Tipo embebido propio del curso (refleja el type Beneficio de Prisma)
export class BeneficioCurso {
  constructor(
    public titulo: string,
    public descripcion: string,
  ) {}
}

// Una sola imagen por curso (ver nota en create-curso.dto.ts).
export interface CursoImagenes {
  principal: string;
}

// Pregunta de opción múltiple de un quiz. Es opcional por módulo (no todos los módulos tienen
// uno). Misma forma que ya existía en la rama de David (feature/usuarios-admin-back-nest,
// puerto 3005) -- "respuestaCorrecta" es el texto exacto de la opción correcta, sin id.
export class Quiz {
  constructor(
    public pregunta: string,
    public opciones: string[],
    public respuestaCorrecta: string,
  ) {}
}

// Módulo (clase/capítulo) de un curso. "esGratis" marca los que se pueden ver sin comprar el
// curso (vista previa) -- el candado/paywall que usa esta bandera vive en el sitio del LMS de
// cara al estudiante, no en el admin.
export class ModuloCurso {
  constructor(
    public id: string,
    public nombre: string,
    public orden: number,
    public esGratis: boolean,
    public bunnyVideoId?: string,
    public quizzes?: Quiz[],
    public bunnyLibraryId?: string,
  ) {}
}

export class Curso {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public fechaCreacion: Date,
    public fechaInicio: Date,
    public fechaFinal: Date,
    public precio: number,
    public estado: boolean,
    public imagenes: CursoImagenes,
    public duracionSemanas: number,
    public profesorId: string,
    public categoriaId: string,
    public resumenDescripcion?: string,
    public valoracion?: number,
    public planetaId?: string,
    public profesor?: Profesor,
    public categoria?: Categoria,
    public planeta?: Planeta,
    public beneficios?: BeneficioCurso[],
    public modulos?: ModuloCurso[],
    public duracionEstimadaMinutos?: number,
  ) {}
}