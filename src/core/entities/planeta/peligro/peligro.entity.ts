export class Peligro {
  constructor(
    public nombre: string,
    public descripcion: string,
    public nivelRiesgo?: string,
    public temperatura?: string,
    public villano?: string,
    public cta?: string,
  ) {}

  static fromPrisma(data: any): Peligro {
    return new Peligro(
      data.nombre,
      data.descripcion,
      data.nivelRiesgo,
      data.temperatura,
      data.villano,
      data.cta,
    );
  }
}
