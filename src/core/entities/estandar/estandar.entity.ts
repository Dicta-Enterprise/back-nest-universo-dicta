export class Estandar {
  constructor(
    public id: string,
    public descripcion: string,
  ) {}

  static fromPrismaList(data: Estandar[]): Estandar[] {
    return data.map((item) => Estandar.fromPrisma(item));
  }

  static fromPrisma(data: Estandar): Estandar {
    return new Estandar(data.id, data.descripcion);
  }
}
