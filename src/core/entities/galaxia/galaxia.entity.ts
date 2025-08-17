import { Categoria } from '../categoria/categoria.entity';

export class Vector3 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  static fromPrisma(data: any): Vector3 | null {
    if (!data) return null;
    return new Vector3(data.x, data.y, data.z);
  }
}

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
    public posicion: Vector3 | null,
    public rotacion: Vector3 | null,
  ) {}

  static fromPrisma(data: any): Galaxia {
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
      Vector3.fromPrisma(data.posicion),
      Vector3.fromPrisma(data.rotacion),
    );
  }

  static fromPrismaList(data: any[]): Galaxia[] {
    return data.map((item) => Galaxia.fromPrisma(item));
  }
}
