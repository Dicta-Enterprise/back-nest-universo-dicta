import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';


// enum EstadoCurso {
//   ACTIVO
//   INACTIVO
// }


enum EstadoCurso {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class CreateCursoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsDate()
  @Type(() => Date)
  fechaCreacion: Date;

  @IsDate()
  @Type(() => Date)
  fechaInicio: Date;

  @IsDate()
  @Type(() => Date)
  fechaFinalizacion: Date;

  @IsNumber()
  cantidadAlumnos: number;

  @IsNumber()
  precio: number;

  @IsString()
  profesor: string;

  @IsString()
  estado: EstadoCurso;

  @IsString()
  imagen: string;

  @IsString()
  video: string;

  @IsNumber()
  duracion: number;

  @IsString()
  categoria: string;



  @IsString()
  idioma: string;

  @IsString()
  planetas: string;
}
