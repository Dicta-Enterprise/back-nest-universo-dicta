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
    public fechaFinalizacion: Date,
    public cantidadAlumnos: number,
    public precio: number,
    public profesor: Profesor,
    public estado: EstadoGenerico,
    public imagen: string,
    public video: string,
    public duracion: number,
    public categoria: Categoria,
    public idioma: Estandar,
    public planetas: Planeta,
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
      data.fechaFinalizacion,
      data.cantidadAlumnos,
      data.precio,
      data.profesor,
      data.estado,
      data.imagen,
      data.video,
      data.duracion,
      data.categoria,
      data.idioma,
      data.planetas,
    );
  }
}
