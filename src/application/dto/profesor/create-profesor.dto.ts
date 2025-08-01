import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class createProfesorDto{

    @ApiProperty({ 
        example: "Juan",
        description: "Nombre del profesor"
    })
    @MinLength(1, {message: 'El nombre debe tener mas de 1 carácter.'})
    @MaxLength(50, {message: 'El nombre debe tener menos de 50 caracteres.'})
    @IsString({message: 'El nombre debe ser un dato de tipo String.'})
    @IsNotEmpty({message: 'El nombre no debe estar vacío.'})
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, {
    message: 'El nombre solo puede contener letras, números y espacios',
    })
    @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
    nombre: string;

    @ApiProperty({
        example: "12345678",
        description: "Documento de Identidad del profesor"
    })
    @MinLength(8, {message: 'El dni debe tener mas de 7 caracteres.'})
    @MaxLength(20, {message: 'El dni debe tener menos de 14 caracteres.'})
    @IsNumberString({},{message: 'El dni debe ser un dato de tipo Number(Integer).'})
    @IsNotEmpty({message: 'El dni no debe estar vacío.'})
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, {
    message: 'El dni solo puede contener letras, números y espacios',
    })
    @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
    dni: string;

    @ApiProperty({ 
        example: "Pérez",
        description: "Apellido paterno del profesor"
    })
    @MinLength(1, {message: 'El apellido paterno debe tener mas de 1 carácter.'})
    @MaxLength(50, {message: 'El apellido paterno debe tener menos de 50 caracteres.'})
    @IsString({message: 'El apellido paterno debe ser un dato de tipo String.'})
    @IsNotEmpty({message: 'El apellido paterno no debe estar vacío.'})
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, {
    message: 'El apellido paterno solo puede contener letras, números y espacios',
    })
    @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
    apellido_paterno: string;

    @ApiProperty({
        example: "Martinez",
        description: "Apellido materno del profesor"
    })
    @MinLength(1, {message: 'El apellido materno debe tener mas de 1 carácter.'})
    @MaxLength(50, {message: 'El apellido materno debe tener menos de 50 caracteres.'})
    @IsString({message: 'El apellido materno debe ser un dato de tipo String.'})
    @IsNotEmpty({message: 'El apellido materno no debe estar vacío.'})
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/, {
    message: 'El apellido materno solo puede contener letras, números y espacios',
    })
    @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
    apellido_materno: string;

    @ApiProperty({
        example: "True",
        description: "Estado del profesor"
    })
    @IsOptional()
    @IsBoolean({message: 'El estado debe ser un valor de tipo boolean.'})
    estado_p: boolean;

    @ApiProperty({ 
        example: "juan@correo.com",
        description: "Email del profesor"
    })
    @MinLength(1, {message: 'El email debe tener mas de 1 carácter.'})
    @MaxLength(100, {message: 'El email debe tener menos de 100 caracteres.'})
    @IsEmail({},{message: 'Debe ingresar un correo electronico válido.'})
    @IsNotEmpty({message: 'El email no debe estar vacío.'})
    @Transform(({ value }) => (value as string).trim().toLowerCase().replaceAll(' ',''))
    email:string;

    
    cursos:string[];
    
}