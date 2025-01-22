import { EstadoGenerico } from "@prisma/client";
import {
    IsEnum,
    IsOptional,
    IsString
} from "class-validator";

export class CreateLandingPageDto {
    @IsString()
    titulo: string;

    @IsString()
    descripcion: string;

    @IsString()
    contenido: string;

    @IsOptional()
    @IsEnum(EstadoGenerico, {
        message:
            'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
    })
    estado: EstadoGenerico;
}