export class Planeta {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public imagen: string,
    public estado: string,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
  ) {}

  static fromPrismaList(data: any[]): Planeta[] {
    return data.map((item) => Planeta.fromPrisma(item));
  }

  static fromPrisma(data: any): Planeta {
    return new Planeta(
      data.id,
      data.nombre,
      data.descripcion,
      data.imagen,
      data.estado,
      data.createdAt,
      data.updatedAt,
    );
  }
}
