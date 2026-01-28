export class Peligro {
  constructor(
    public nombre: string,
    public descripcion: string,
    public nivelRiesgo?: string,
    public temperatura?: string,
    public villano?: string,
    public cta?: string,
  ) {}
}
