import { EstadoGenerico } from "@prisma/client";
import { Categoria } from "../categoria/categoria.entity";
import { Profesor } from "../profesor/profesor.entity";
import { Estandar } from "../estandar/estandar.entity";
import { Planeta } from "../planeta/planeta.entity";


export class Curso{
    constructor(
        public id: string,
        public nombre: string,
        public descripcion: string,
        public fechaCreacion: Date,
        public fechaInicio: Date,
        public fechaFinalizacion: Date,
        public cantidadAlumnos: number,
        public precio: number,
        public profesor:Profesor,
        public estado: EstadoGenerico,
        public imagen:string,
        public video:string,
        public duracion:number,
        public categoria:Categoria,
        public idioma:Estandar,
        public planetas:Planeta
    ){}
}