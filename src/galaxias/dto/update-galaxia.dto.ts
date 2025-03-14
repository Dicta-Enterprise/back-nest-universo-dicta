import { PartialType } from '@nestjs/mapped-types';
import { CreateGalaxiaDto } from './create-galaxia.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoGenerico } from '@prisma/client';

export class UpdateGalaxiaDto extends PartialType(CreateGalaxiaDto) {

    @ApiPropertyOptional({
        example: "Galaxia Actualizada",
        description: "Nuevo nombre de galaxia (opcional)"
    })
    nombre?: string;

    @ApiPropertyOptional({
        example: "Actualización de la descripcion",
        description: "Nueva descripción de galaxia (opcional)"
    })
    descripcion?: string;

    @ApiPropertyOptional({
        example: "https://example.com/galaxia-imagenNueva.jpg",
        description: "Nueva URL de la imagen representativa (opcional)"
    })
    imagen?: string;

    @ApiPropertyOptional({
        example: "ACTIVO",
        description: "Cambio de estado de galaxia (opcional)"
    })
    estado?: EstadoGenerico;

}
