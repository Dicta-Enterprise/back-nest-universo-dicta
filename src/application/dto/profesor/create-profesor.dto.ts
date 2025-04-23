import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";


export class createProfesorDto{
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (value as string).trim().toLowerCase())
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (value as string).trim().toLowerCase())
    apellido: string;

    @IsString()
    @IsNotEmpty()
    email:string;
    
}