import { Beneficio } from './../planeta/beneficio/beneficio.entity';
import { Categoria } from '../categoria/categoria.entity';
import { Profesor } from '../profesor/profesor.entity';

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
    public profesor?: Profesor,
    public categoria?: Categoria,
    public beneficios?: Beneficio[],
    /*
    public idioma: Estandar,
    public planetas: Planeta,*/
  ) {}

  static fromPrismaList(data: Curso[]): Curso[] {
    return data.map((item) => Curso.fromPrisma(item));
  }

  static fromPrisma(data: Curso): Curso {
    return new Curso(
      data.id,
      data.nombre,
      data.descripcion,
      data.fechaCreacion,
      data.fechaInicio,
      data.fechaFinal,
      data.precio,
      data.estado,
      data.imagen,
      data.duracionSemanas,
      data.profesorId,
      data.categoriaId,
      data.profesor,
      data.categoria,
      data.beneficios,
      /*
      data.idioma,
      data.planetas,*/
    );
  }
}
