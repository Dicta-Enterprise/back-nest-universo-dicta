import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class BeneficioDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}

// Pregunta de opción múltiple de un quiz. Es opcional por módulo (pedido de Carlos: no todos
// los módulos necesitan quiz). Misma forma que ya existía en la rama de David
// (feature/usuarios-admin-back-nest, puerto 3005) -- "respuestaCorrecta" es el texto exacto de
// la opción correcta, no un índice. Sin id (esa rama tampoco lo tiene).
export class QuizDto {
  @ApiProperty({ example: '¿Qué es el ciberacoso?' })
  @MinLength(2, { message: 'La pregunta debe tener mas de 1 carácter.' })
  @MaxLength(300, { message: 'La pregunta debe tener menos de 300 caracteres.' })
  @IsString()
  @IsNotEmpty()
  pregunta: string;

  @ApiProperty({ example: ['Opción A', 'Opción B', 'Opción C'], type: [String] })
  @IsArray()
  @ArrayMinSize(2, { message: 'Debe haber al menos 2 opciones.' })
  @IsString({ each: true })
  opciones: string[];

  @ApiProperty({ example: 'Opción A', description: 'Texto exacto de la opción correcta.' })
  @IsString()
  @IsNotEmpty()
  respuestaCorrecta: string;
}

// Módulo (clase/capítulo) del curso. "esGratis" lo marca como vista previa, visible sin comprar
// el curso -- el candado/paywall que usa esta bandera vive en el sitio del LMS, no en el admin.
// El id lo genera el panel al crear un módulo nuevo (para distinguir editar de agregar).
export class ModuloDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Qué es el ciberacoso' })
  @MinLength(2, { message: 'El nombre del módulo debe tener mas de 1 carácter.' })
  @MaxLength(150, { message: 'El nombre del módulo debe tener menos de 150 caracteres.' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 1, description: 'Orden en el que aparece dentro del curso.' })
  @IsNumber()
  @Min(1)
  orden: number;

  @ApiProperty({ example: false, description: 'Si se puede ver sin comprar el curso.' })
  @IsBoolean()
  esGratis: boolean;

  @ApiProperty({ required: false, description: 'Id del video en Bunny Stream, si ya se subió.' })
  @IsString()
  @IsOptional()
  bunnyVideoId?: string;

  @ApiProperty({ required: false, description: 'Biblioteca de Bunny Stream donde vive bunnyVideoId.' })
  @IsString()
  @IsOptional()
  bunnyLibraryId?: string;

  @ApiProperty({
    required: false,
    description: 'Quiz opcional del módulo (no todos los módulos necesitan uno).',
    type: [QuizDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizDto)
  quizzes?: QuizDto[];
}

// Una sola imagen por curso (decisión de Carlos/Wilson, reunión 30-sep-2026): se usa la misma
// en el catálogo y en la LMS, en vez de las 6 versiones (principal/secundaria x pc/tablet/mobile)
// que se subían antes a Cloudinary.
class CursoImagenesDto {
  @IsUrl({}, { message: 'Debe ser una URL válida.' })
  @IsNotEmpty()
  principal: string;
}

export class CreateCursoDto {
  @ApiProperty({
    example: 'Matemática básica.',
    description: 'Nombre del curso.'
  })
  @MinLength(2, { message: 'El nombre debe tener mas de 1 carácter.' })
  @MaxLength(100, { message: 'El nombre debe tener menos de 100 caracteres.' })
  @IsString({ message: 'El nombre debe ser un dato de tipo String.' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío.' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,:;()\-]+$/, {
    message: 'El nombre solo puede contener letras, números y signos básicos',
  })
  nombre: string;

  @ApiProperty({
    example: 'Curso para aprender a realizar operaciones con los operadores matemáticos.',
    description: 'Descripción del curso.'
  })
  @MinLength(2, { message: 'La descripción debe tener mas de 2 caracteres.' })
  @MaxLength(1000, { message: 'La descripción debe tener menos de 1000 caracteres.' })
  @IsString({ message: 'La descripción debe ser un dato de tipo String.' })
  @IsNotEmpty({ message: 'La descripción no debe estar vacía.' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,:;()\-]+$/, {
    message: 'La descripción solo puede contener letras, números y signos básicos',
  })
  descripcion: string;

  @ApiProperty({ 
    description: 'URL de la imagen principal original (Opcional si se sube como archivo físico).',
    required: false 
  })
  @IsString()
  @IsOptional()
  urlPrincipalOriginal?: string;

  @ApiProperty({ 
    description: 'URL de la imagen secundaria original (Opcional si se sube como archivo físico).',
    required: false 
  })
  @IsString()
  @IsOptional()
  urlSecundariaOriginal?: string;

  @IsOptional()
  imagenes?: CursoImagenesDto; 

  @ApiProperty({
    example: 'Curso completo de matemáticas básicas para principiantes',
    description: 'Resumen breve del curso para mostrar en tarjetas.'
  })
  @MinLength(10, { message: 'El resumen debe tener al menos 10 caracteres.' })
  @MaxLength(200, { message: 'El resumen debe tener menos de 200 caracteres.' })
  @IsString({ message: 'El resumen debe ser un dato de tipo String.' })
  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,:;()\-]+$/, {
    message: 'El resumen solo puede contener letras, números y signos básicos',
  })
  resumenDescripcion?: string;

  @ApiProperty({
    example: 4.5,
    description: 'Valoración del curso (0-5)',
    minimum: 0,
    maximum: 5
  })
  @Min(0, { message: 'La valoración debe ser mayor o igual a 0.' })
  @Max(5, { message: 'La valoración debe ser menor o igual a 5.' })
  @IsNumber({}, { message: 'La valoración debe ser un valor de tipo Number.' })
  @IsOptional()
  @Transform(({ value }) =>
    value !== null && value !== undefined
      ? parseFloat(String(value).trim())
      : value
  )
  valoracion?: number;

  @ApiProperty({
    example: '2025-05-31T05:11:55.496Z',
    description: 'Fecha de creación del curso.'
  })
  @IsDate({ message: 'La fecha de creación debe cumplir con el formato de la fecha.' })
  @IsOptional()
  @Type(() => Date)
  fechaCreacion: Date;

  @ApiProperty({
    example: '2025-05-31T05:11:55.496Z',
    description: 'Fecha de inicio del curso.'
  })
  @IsDate({ message: 'La fecha de inicio debe cumplir con el formato de la fecha.' })
  @IsOptional()
  @Type(() => Date)
  fechaInicio: Date;

  @ApiProperty({
    example: '2025-05-31T05:11:55.496Z',
    description: 'Fecha de finalización del curso.'
  })
  @IsDate({ message: 'La fecha final debe cumplir con el formato de la fecha.' })
  @IsOptional()
  @Type(() => Date)
  fechaFinal: Date;

  @ApiProperty({
    example: 250.90,
    description: 'Precio del curso.'
  })
  @Min(0.0, { message: 'El precio debe ser mayor a 0.' })
  @Max(12000000, { message: 'El precio debe ser menor a 12 millones.' })
  @IsNotEmpty({ message: 'El precio no debe estar vacío.' })
  @Transform(({ value }) =>
    value !== null && value !== undefined
      ? parseFloat(String(value).trim())
      : value
  )
  precio: number;

  @ApiProperty({
    example: true,
    description: 'Estado del curso.'
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor de tipo boolean.' })
  estado: boolean;

  @ApiProperty({
    example: 5.5,
    description: 'Duración del curso medido por semanas.'
  })
  @Min(0.0, { message: 'La duración debe ser mayor a 0.' })
  @Max(101.0, { message: 'La duración debe ser menor a 101.' })
  @IsOptional()
  @Transform(({ value }) =>
    value !== null && value !== undefined
      ? parseFloat(String(value).trim())
      : value
  )
  duracionSemanas: number;

  @ApiProperty({
    example: '64fd1c2f9a25d8e3f41b9c7a',
    description: 'Id del profesor asignado al curso.'
  })
  @IsMongoId({ message: 'profesorId debe ser MongoID.' })
  @IsString({ message: 'profesorId debe ser un dato de tipo String.' })
  @IsNotEmpty({ message: 'profesorId no debe estar vacío.' })
  @Transform(({ value }) =>
    (value as string).trim().toLowerCase().replaceAll(' ', '')
  )
  profesorId: string;

  @ApiProperty({
    example: '5f43e9b5e3f1c530d8b6f8a9',
    description: 'Id de la categoría asignada al curso.'
  })
  @IsMongoId({ message: 'categoriaId debe ser MongoID.' })
  @IsString({ message: 'categoriaId debe ser un dato de tipo String.' })
  @IsNotEmpty({ message: 'categoriaId no debe estar vacío.' })
  @Transform(({ value }) =>
    (value as string).trim().toLowerCase().replaceAll(' ', '')
  )
  categoriaId: string;

  @ApiProperty({
    example: '7a21b3c4d5e6f7a8b9c0d1e2',
    description: 'Id del planeta asignado al curso.',
    required: false,
  })
  @IsMongoId({ message: 'planetaId debe ser MongoID.' })
  @IsString({ message: 'planetaId debe ser un dato de tipo String.' })
  @IsOptional()
  @Transform(({ value }) =>
    (value as string).trim().toLowerCase().replaceAll(' ', '')
  )
  planetaId?: string;

  @ApiProperty({
    example: [
      { titulo: 'Aprender sumas', descripcion: 'Sumar correctamente' }
    ],
    description: 'Lista de beneficios del curso.',
    required: false,
    type: [BeneficioDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BeneficioDto)
  beneficios: BeneficioDto[];

  @ApiProperty({
    description: 'Lista de módulos (clases) del curso, con su orden y si son vista previa gratis.',
    required: false,
    type: [ModuloDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuloDto)
  modulos?: ModuloDto[];

  @ApiProperty({
    example: 45,
    description: 'Tiempo estimado para completar el curso, en minutos.',
    required: false,
  })
  @Min(1, { message: 'La duración estimada debe ser mayor a 0.' })
  @IsNumber({}, { message: 'La duración estimada debe ser un valor de tipo Number.' })
  @IsOptional()
  @Transform(({ value }) =>
    value !== null && value !== undefined
      ? parseFloat(String(value).trim())
      : value
  )
  duracionEstimadaMinutos?: number;
}