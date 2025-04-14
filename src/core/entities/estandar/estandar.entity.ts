export class Estandar {
  constructor(
    public id: string,
    public descripcion: string,
  ) {}

  static fromPrismaList(data: any[]): Estandar[] {
    return data.map((item) => Estandar.fromPrisma(item));
  }

  static fromPrisma(data: any): Estandar {
    return new Estandar(data.id, data.descripcion);
  }
}
