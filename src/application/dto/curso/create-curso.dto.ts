import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCursoDto {

  @ApiProperty({ 
          example: "Matemática básica.",
          description: "Nombre del curso."
      })
  @MinLength(2, {message: 'El nombre debe tener mas de 1 carácter.'})
  @MaxLength(100, {message: 'El nombre debe tener menos de 100 caracteres.'})
  @IsString({message: 'El nombre debe ser un dato de tipo String.'})
  @IsNotEmpty({message: 'El nombre no debe estar vacío.'})
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, {
      message: 'El nombre solo puede contener letras, números y espacios',
  })
  nombre: string;

  @ApiProperty({ 
        example: "Curso para aprender a realizar operaciones con los operadores matemáticos.",
        description: "Descripción del curso."
    })
  @MinLength(2, {message: 'La descripción debe tener mas de 2 caracteres.'})
  @MaxLength(1000, {message: 'La descripción debe tener menos de 1000 caracteres.'})
  @IsString({message: 'La descripción debe ser un dato de tipo String.'})
  @IsNotEmpty({message: 'La descripción no debe estar vacía.'})
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, {
    message: 'La descripción solo puede contener letras, números y espacios',
    })
  descripcion: string;

  @ApiProperty({ 
        example: "2025-05-31T05:11:55.496Z",
        description: "Fecha de creación del curso."
    })
  @MinLength(0, {message: 'La fecha de creación debe tener mas de 0 caracteres.'})
  @MaxLength(20, {message: 'La fecha de creación debe tener menos de 20 caracteres.'})
  @IsDate({message: 'La fecha de creación debe cumplir con el formato de la fecha.'})
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @ApiProperty({ 
        example: "2025-05-31T05:11:55.496Z",
        description: "Fecha de inicio del curso."
    })
  @MinLength(0, {message: 'La fecha de inicio debe tener mas de 0 caracteres.'})
  @MaxLength(20, {message: 'La fecha de inicio debe tener menos de 20 caracteres.'})
  @IsDate({message: 'La fecha de inicio debe cumplir con el formato de la fecha.'})
  @IsOptional()
  @Type(() => Date)
  fechaInicio: Date;

  @ApiProperty({ 
        example: "2025-05-31T05:11:55.496Z",
        description: "Fecha de finalización del curso."
    })
  @MinLength(0, {message: 'La fecha final debe tener mas de 0 caracteres.'})
  @MaxLength(20, {message: 'La fecha final debe tener menos de 20 caracteres.'})
  @IsDate({message: 'La fecha final debe cumplir con el formato de la fecha.'})
  @IsOptional()
  @Type(() => Date)
  fechaFinal: Date;
  
  @ApiProperty({ 
        example: "250.90",
        description: "Precio del curso."
    })
  @Min(0.0, {message: 'El precio debe ser mayor a 0.'})
  @Max(12000000, {message: 'El precio debe ser menor a 12 millones.'})
  @IsNumber({},{message: 'El precio debe ser un valor de tipo Number(Integer/Float/Decimal).'})
  @IsNotEmpty({message: 'El precio no debe estar vacío.'})
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
  precio: number;

  @ApiProperty({ 
        example: "true",
        description: "Estado del curso."
    })
  @MinLength(0, {message: 'El estado debe tener 1 o mas caracteres.'})
  @MaxLength(15, {message: 'El estado debe tener menos de 15 caracteres.'})
  @IsOptional()
  @IsBoolean({message: 'El estado debe ser un valor de tipo boolean.'})
  estado: boolean;

  @ApiProperty({ 
        example: "www.example.com/matematica_icono.png",
        description: "Imagen del curso."
    })
  @MinLength(2, {message: 'La imagen debe tener mas de 1 carácter.'})
  @MaxLength(250, {message: 'La imagen debe tener menos de 250 caracteres.'})
  @IsString({message: 'La imagen debe ser un dato de tipo String.'})
  @IsUrl({},{message: 'La imagen debe ser un URL.'})
  @IsNotEmpty({message: 'La imagen no debe estar vacía.'})
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
  imagen: string;

  @ApiProperty({ 
        example: "5.5",
        description: "Duración del curso medido por semanas."
    })
  @Min(0.0, {message: 'La duración debe ser mayor a 0.'})
  @Max(101.0, {message: 'La duración debe ser menor a 101.'})
  @IsNumber({},{message: 'La duración debe ser un valor de tipo Number(Integer/Float/Decimal).'})
  @IsOptional()
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
  duracionSemanas: number;
  
  @ApiProperty({ 
        example: "64fd1c2f9a25d8e3f41b9c7a",
        description: "Id del profesor asignado al curso."
    })
  @IsMongoId({message: 'profesorId debe ser MongoID.'})
  @IsString({message: 'profesorId debe ser un dato de tipo String.'})
  @IsNotEmpty({message: 'profesorId no debe estar vacío.'})
  @Transform(({ value }) => (value as string).trim().toLowerCase().replaceAll(' ',''))
  profesorId: string;

  @ApiProperty({ 
        example: "5f43e9b5e3f1c530d8b6f8a9",
        description: "Id de la categoría asignada al curso."
    })
  @IsMongoId({message: 'categoriaId debe ser MongoID.'})
  @IsString({message: 'categoriaId debe ser un dato de tipo String.'})
  @IsNotEmpty({message: 'categoriaId no debe estar vacío.'})
  @Transform(({ value }) => (value as string).trim().toLowerCase().replaceAll(' ',''))
  categoriaId: string;

}
