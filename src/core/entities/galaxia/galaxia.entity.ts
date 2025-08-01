import { Categoria } from '../categoria/categoria.entity';

export class Galaxia {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public imagen: string,
    public estado: boolean,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public categorias: Categoria[],
  ) {}

  static fromPrismaList(data: any[]): Galaxia[] {
    return data.map((item) => Galaxia.fromPrisma(item));
  }

  

    static fromPrisma(data: any): Galaxia {
        return new Galaxia(
            data.id,
            data.nombre,
            data.descripcion,
            data.imagen,
            data.estado,
            data.fechaCreacion,
            data.fechaActualizacion,
            data.categorias ? Categoria.fromPrismaList(data.categorias) : [],
        );
    }

 
}
