import { PartialType } from "@nestjs/mapped-types";
import { CreateLandingPageDto } from "./create-landing-page.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { EstadoGenerico } from "@prisma/client";

export class UpdateLandingPageDto extends PartialType(CreateLandingPageDto) {
    @ApiPropertyOptional({ 
        example: "Nueva Landing",
        description: "Nuevo título de la landing page (opcional)"
    })
    titulo?: string;

    @ApiPropertyOptional({ 
        example: "Actualización ",
        description: "Nueva descripción de la landing page (opcional)"
    })
    descripcion?: string;

    @ApiPropertyOptional({
        example: ["La misión ha", "cambiado de rumbo"],
        description: "Actualización del contenido de la landing page (opcional)"
    })
    contenido?: string[];

    @ApiPropertyOptional({ 
        example: "6792877e2942e670016454de",
        description: "Nuevo ID del planeta asociado (opcional)"
    })
    planetaId?: string;

    @ApiPropertyOptional({
        example: "ACTIVO",
        description: "Cambio de estado de la landing page (opcional)"
    })
    estado?: EstadoGenerico;

    @ApiPropertyOptional({
        example: "#4287f5",
        description: "Nuevo color principal en formato hexadecimal (opcional)"
    })
    color?: string;

    @ApiPropertyOptional({
        example: "https://media-public.canva.com/uW7NI/MAD9dCuW7NI/1/tl.png",
        description: "Nueva URL de la imagen representativa (opcional)"
    })
    imagenUrl?: string;
}