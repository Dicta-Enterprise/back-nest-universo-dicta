import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";


export class createProfesorDto{
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    apellido: string;

    @IsString()
    @IsNotEmpty()
    email:string;
    
}