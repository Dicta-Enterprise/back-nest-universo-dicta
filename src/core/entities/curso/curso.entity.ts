import { EstadoGenerico } from '@prisma/client';
import { Categoria } from '../categoria/categoria.entity';
import { Profesor } from '../profesor/profesor.entity';
import { Estandar } from '../estandar/estandar.entity';
import { Planeta } from '../planeta/planeta.entity';

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
    /*
    public idioma: Estandar,
    public planetas: Planeta,*/
  ) {}

  static fromPrismaList(data: any[]): Curso[] {
    return data.map((item) => Curso.fromPrisma(item));
  }

  static fromPrisma(data: any): Curso {
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
      /*
      data.idioma,
      data.planetas,*/
    );
  }
}
