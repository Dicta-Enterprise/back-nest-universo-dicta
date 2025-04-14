export class Profesor {
  constructor(
    public id: string,
    public nombre: string,
    public apellido: string,
    public email: string,
  ) {}

  static fromPrismaList(data: any[]): Profesor[] {
    return data.map((item) => Profesor.fromPrisma(item));
  }

  static fromPrisma(data: any): Profesor {
    return new Profesor(data.id, data.nombre, data.apellido, data.email);
  }
}
