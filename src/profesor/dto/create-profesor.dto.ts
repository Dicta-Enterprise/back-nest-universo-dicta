import { ApiProperty } from "@nestjs/swagger";
import { EstadoGenerico } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, IsUrl, Matches, MaxLength, Min } from "class-validator";

export class CreateProfesorDto {

    @ApiProperty({ example: 'Juan Pablo', description: 'Nombre del profesor' })
    @IsString({ message: 'El nombre del Profesor debe ser un string' })
    @IsNotEmpty({ message: 'El nombre del Profesor no puede estar vacío' })
    @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
    @Transform(({ value }) => (typeof value == 'string' ? value.trim() : value))
    nombre: string;

    @ApiProperty({ example: 'Perez Chavez', description: 'Apellido del profesor' })
    @IsString({ message: 'El apellido debe ser un string' })
    @IsNotEmpty({ message: 'El apellido no puede estar vacía' })
    @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
    @Transform(({ value }) => (typeof value == 'string' ? value.trim() : value))
    apellido: string;

    @ApiProperty({ example: 'JuanPerez@correo.com' })
    @IsEmail({}, { message: 'El correo electrónico debe ser un email válido' })
    @IsNotEmpty({ message: 'El Email no puede estar vacía' })
    email: string;

    @ApiProperty({ example: '+51 987 654 321', description: 'Número de teléfono del profesor' })
    @IsString({ message: 'El teléfono debe ser un texto' })
    @Matches(/^\+?\d{1,4}(\s\d{3}){2,4}$/, {
        message: 'El teléfono debe ser un número válido con 9 a 15 dígitos, opcionalmente con un prefijo "+" y espacios entre grupos de dígitos',
    })
    @IsNotEmpty({ message: 'El teléfono no puede estar vacío' })
    @Transform(({ value }) => (typeof value == 'string' ? value.trim() : value))
    telefono: string;

    @ApiProperty({ example: 'Av. Principal 123, Lima', description: 'Dirección del profesor' })
    @IsString({ message: 'La dirección debe ser un texto' })
    @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
    @MaxLength(100, { message: 'La dirección no puede tener más de 100 caracteres' })
    @Transform(({ value }) => (typeof value == 'string' ? value.trim() : value))
    direccion: string;

    @ApiProperty({ example: 'https://example.com/profesor-imagen2.jpg' })
    @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
    @Transform(({ value }) => (typeof value == 'string' ? value.trim() : value))
    imagen: string;

    @ApiProperty({ example: '1990-05-15', description: 'Fecha de nacimiento del profesor en formato ISO' })
    @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
    @Transform(({ value }) => new Date(value))
    fechaNacimiento: Date;

    @ApiProperty({ example: 'ACTIVO', enum: EstadoGenerico })
    @IsString({ message: 'El estado debe ser un texto' })
    @IsEnum(EstadoGenerico, {
        message:
            'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
    })
    estado: EstadoGenerico;

}
