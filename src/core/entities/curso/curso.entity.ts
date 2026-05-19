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
    public imagen: string,
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
  ) {}
}