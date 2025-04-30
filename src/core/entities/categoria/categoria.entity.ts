export class Categoria {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public imagenUrl: string,
    public estado: boolean,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
  ) {}

  public desactivar(): void {
    this.estado = false;
  }

  static fromPrismaList(data: any[]): Categoria[] {
    return data.map((item) => Categoria.fromPrisma(item));
  }

  static fromPrisma(data: any): Categoria {
    return new Categoria(
      data.id,
      data.nombre,
      data.descripcion,
      data.imagenUrl,
      data.estado,
      data.createdAt,
      data.updatedAt,
    );
  }
}
