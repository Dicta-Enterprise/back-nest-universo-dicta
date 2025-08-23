export class Beneficio {
  constructor(
    public titulo: string,
    public descripcion: string,
  ) {}

  static fromPrisma(data: any): Beneficio {
    return new Beneficio(
      data.titulo,
      data.descripcion,
    );
  }
}
