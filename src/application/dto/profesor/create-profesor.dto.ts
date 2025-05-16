import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class createProfesorDto{

    @ApiProperty({ 
        example: "Juan",
        description: "Nombre del profesor"
    })
    @MinLength(1, {message: 'El nombre debe tener mas de 1 caracter.'})
    @MaxLength(50, {message: 'El nombre debe tener menos de 50 caracteres.'})
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (value as string).trim().toLowerCase().replaceAll(' ',''))
    nombre: string;

    @ApiProperty({
        example: "12345678",
        description: "Documento de Identidad del profesor"
    })
    @MinLength(8, {message: 'El dni debe tener mas de 7 caracteres.'})
    @MaxLength(20, {message: 'El dni debe tener menos de 14 caracteres.'})
    @IsNumberString()
    @IsNotEmpty()
    @Transform(({ value }) => (value as string).trim().toLowerCase().replaceAll(' ',''))
    dni: string;

    @ApiProperty({ 
        example: "Perez",
        description: "Apellido paterno del profesor"
    })
    @MinLength(1, {message: 'El apellido paterno debe tener mas de 1 caracter.'})
    @MaxLength(50, {message: 'El apellido paterno debe tener menos de 50 caracteres.'})
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (value as string).trim().toLowerCase().replaceAll(' ',''))
    apellido_paterno: string;

    @ApiProperty({
        example: "Martinez",
        description: "Apellido materno del profesor"
    })
    @MinLength(1, {message: 'El apellido materno debe tener mas de 1 caracter.'})
    @MaxLength(50, {message: 'El apellido materno debe tener menos de 50 caracteres.'})
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (value as string).trim().toLowerCase().replaceAll(' ',''))
    apellido_materno: string;

    @ApiProperty({
        example: "True",
        description: "Estado del profesor"
    })
    @IsOptional()
    @IsBoolean()
    estado_p: boolean;

    @ApiProperty({ 
        example: "juan@correo.com",
        description: "Email del profesor"
    })
    @MinLength(1, {message: 'El email debe tener mas de 1 caracter.'})
    @MaxLength(100, {message: 'El email debe tener menos de 100 caracteres.'})
    @IsEmail({},{message: 'Debe ingresar un correo electronico valido.'})
    @IsNotEmpty()
    @Transform(({ value }) => (value as string).trim().toLowerCase().replaceAll(' ',''))
    email:string;
    
}