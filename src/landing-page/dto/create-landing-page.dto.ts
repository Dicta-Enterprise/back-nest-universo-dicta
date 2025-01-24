import { EstadoGenerico } from "@prisma/client";
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    ValidateNested
} from "class-validator";

export class CreateLandingPageDto {
    @IsString({ message: "El título debe ser un string válido." })
    @IsNotEmpty({ message: "El título no puede estar vacío." })
    titulo: string;

    @IsString({ message: "La descripción debe ser un string válido." })
    @IsNotEmpty({ message: "La descripción no puede estar vacía." })
    descripcion: string;

    @IsArray({ message: "El contenido debe ser un array de strings." })
    @ArrayNotEmpty({ message: "El contenido no puede estar vacío." })
    @IsString({ each: true, message: "Cada elemento del contenido debe ser un string válido." })
    contenido: string[];

    @IsOptional()
    @IsEnum(EstadoGenerico, {
        message:
            'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
    })
    estado: EstadoGenerico;

    @IsString({ message: "El ID del planeta debe ser un string válido." })
    @IsNotEmpty({ message: "El ID del planeta no puede estar vacío." })
    @IsMongoId({ message: "El ID del planeta debe ser un ObjectId válido." })
    planetaId: string;

    @IsOptional()
    @IsString({ message: "El color debe ser un string válido." })
    color?: string;

    @IsOptional()
    @IsUrl(
        { require_tld: true },
        { message: "El valor de imagenUrl debe ser una URL válida." }
    )
    imagenUrl?: string;
}
