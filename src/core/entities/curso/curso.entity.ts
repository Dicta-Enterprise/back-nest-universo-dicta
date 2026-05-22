import { Beneficio } from './../planeta/beneficio/beneficio.entity';
import { Categoria } from '../categoria/categoria.entity';
import { Profesor } from '../profesor/profesor.entity';


export interface ImagenesVersion{
  principal: string;
  secundaria: string;
}

export interface CursoImagenes{ 
  mobile: ImagenesVersion;
  tablet: ImagenesVersion;
  pc: ImagenesVersion;
}

export class Curso {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public fechaCreacion: Date,
    public fechaInicio: Date,
    public fechaFinal: Date,
    public precio: number,
    public estado: boolean,
    public imagenes: CursoImagenes,
    public duracionSemanas: number,
    public profesorId: string,
    public categoriaId: string,
    public resumenDescripcion?: string,  
    public valoracion?: number,           
    public profesor?: Profesor,
    public categoria?: Categoria,
    public beneficios?: Beneficio[],
  ) {}
}