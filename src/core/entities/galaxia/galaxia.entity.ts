import { Categoria } from '../categoria/categoria.entity';
import { Atributos } from '../galaxia/atributos/atributos.entity';

export class Galaxia {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public imagen: string,
    public url: string,
    public textura: string,
    public estado: boolean,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public categoria: Categoria,
    public categoriaId: string,
    public atributos: Atributos[],
  ) {}

  static fromPrisma(data: any): Galaxia {
    return new Galaxia(
      data.id,
      data.nombre,
      data.descripcion,
      data.imagen,
      data.url,
      data.textura,
      data.estado,
      data.fechaCreacion,
      data.fechaActualizacion,
      data.categoria ? Categoria.fromPrisma(data.categoria) : null,
      data.categoriaId,
      data.atributos ? Atributos.fromPrismaList(data.atributos) : [],
    );
  }

  static fromPrismaList(data: any[]): Galaxia[] {
    return data.map((item) => Galaxia.fromPrisma(item));
  }
}
