import { VectorGalaxia } from './vector.entity';

export class Galaxia {
  constructor(
    public id: string,
    public nombre: string,
    public tema: string,
    public descripcion: string,
    public imagen: string | null,
    public url: string | null,
    public textura: string | null,
    public estado: boolean,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public categoriaId: string,
    public color: string,
    public posicion: VectorGalaxia | null,
    public rotacion: VectorGalaxia | null,
  ) {}
}
