import { EstadoGenerico } from "@prisma/client";
import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString
} from "class-validator";

export class CreateLandingPageDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsString()
    @IsNotEmpty()
    contenido: string;

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
}