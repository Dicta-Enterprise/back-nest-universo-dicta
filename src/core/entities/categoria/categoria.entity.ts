export class Categoria {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,

    public estado: boolean,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,

    public x?: number,
    public y?: number,
    public z?: number,
    public url?: string,
    public modelo?: string,
  ) {}

  public desactivar(): void {
    this.estado = false;
  }

  static fromPrismaList(data: Categoria[]): Categoria[] {
    return data.map((item) => Categoria.fromPrisma(item));
  }

  static fromPrisma(data: Categoria): Categoria {
    return new Categoria(
      data.id,
      data.nombre,
      data.descripcion,
      data.estado,
      data.fechaCreacion,
      data.fechaActualizacion,
      data.x,
      data.y,
      data.z,
      data.url,
      data.modelo,
    );
  }
}
