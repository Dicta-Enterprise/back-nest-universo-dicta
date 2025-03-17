import { PartialType } from "@nestjs/mapped-types";
import { CreateIdiomaDto } from "./create-idioma.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { EstadoGenerico } from "@prisma/client";

export class UpdateIdiomaDto extends PartialType(CreateIdiomaDto) {

    @ApiPropertyOptional({
        example: "Frances",
        description: "Nuevo nombre del idioma (opcional)"
    })
    nombre?: string;

    @ApiPropertyOptional({
        example: "Francés parisino",
        description: "Nueva descripción del idioma (opcional)"
    })
    descripcion?: string;

    @ApiPropertyOptional({
        example: "ACTIVO",
        description: "Cambio de estado del idioma (opcional)"
    })
    estado?: EstadoGenerico;
}