import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsDate()
  fechaCreacion: Date;

  @IsDate()
  fechaInicio: Date;

  @IsDate()
  fechaFinalizacion: Date;

  @IsNumber()
  cantidadAlumnos: number;

  @IsNumber()
  precio: number;

  @IsString()
  profesor: string;

  @IsString()
  estado: string;

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
