import { EstadoGenerico } from "@prisma/client";
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl
} from "class-validator";

export class CreateLandingPageDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsArray() 
    @ArrayNotEmpty({ message: "El contenido no puede estar vacío." }) 
    @IsString({ each: true, message: "Cada elemento de contenido debe ser un string válido." }) 
    contenido: string[]; 

    @IsOptional()
    @IsEnum(EstadoGenerico, {
        message:
            'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
    })
    estado: EstadoGenerico;

    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    planetaId: string;

    @IsOptional()
    @IsString()
    color?: string; 

    @IsOptional()
    @IsUrl({
        require_tld: true,
    }, {
        message: 'El valor de imagenUrl debe ser una URL válida',
    })
    imagenUrl?: string; 
}
