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
}
