export class Idioma {
  constructor(
    public id: string,
    public nombre: string,
    public estado: boolean,
  ) {}

  public desactivar(): void {
    this.estado = false;
  }

  static fromPrismaList(data: Idioma[]): Idioma[] {
    return data.map((item) => Idioma.fromPrisma(item));
  }

  static fromPrisma(data: Idioma): Idioma {
    return new Idioma(data.id, data.nombre, data.estado);
  }
}
