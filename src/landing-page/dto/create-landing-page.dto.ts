import { IsString } from "class-validator";

export class CreateLandingPageDto {
    @IsString()
    titulo: string;
  
    @IsString()
    descripcion: string;
  
    @IsString()
    contenido: string;
}