import { Categoria } from '../categoria/categoria.entity';
import { VectorGalaxia } from './vector.entity';

export class Galaxia {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public imagen: string | null,
    public url: string | null,
    public textura: string | null,
    public estado: boolean,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public categoria: Categoria | null,
    public categoriaId: string,
    public color: string,
    public posicion: VectorGalaxia | null,
    public rotacion: VectorGalaxia | null,
  ) {}

  static fromPrisma(data: Galaxia): Galaxia {
    return new Galaxia(
      data.id,
      data.nombre,
      data.descripcion,
      data.imagen ?? null,
      data.url ?? null,
      data.textura ?? null,
      data.estado,
      data.fechaCreacion,
      data.fechaActualizacion,
      data.categoria ? Categoria.fromPrisma(data.categoria) : null,
      data.categoriaId,
      data.color,
      VectorGalaxia.fromPrisma(data.posicion),
      VectorGalaxia.fromPrisma(data.rotacion),
    );
  }

  static fromPrismaList(data: Galaxia[]): Galaxia[] {
    return data.map((item) => Galaxia.fromPrisma(item));
  }
}
