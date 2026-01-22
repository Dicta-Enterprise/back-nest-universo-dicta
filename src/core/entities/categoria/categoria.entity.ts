
export class Categoria {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,

    public estado: boolean,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,

    public x?: number,
    public y?: number,
    public z?: number,
    public url?: string,
    public modelo?: string,
  ) {}
}
