import { ApiProperty } from "@nestjs/swagger";
import { EstadoGenerico } from "@prisma/client";
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsHexColor,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
} from "class-validator";

export class CreateLandingPageDto {
    @ApiProperty({ 
        example: "Landing Prueba",
        description: "Título de la landing page"
    })
    @IsString({ message: "El título debe ser un string válido" })
    @IsNotEmpty({ message: "El título no puede estar vacío" })
    titulo: string;

    @ApiProperty({ 
        example: "Encontrarás cosas super waos",
        description: "Descripción de la landing page"
    })
    @IsString({ message: "La descripción debe ser un string válido" })
    @IsNotEmpty({ message: "La descripción no puede estar vacía" })
    descripcion: string;

    @ApiProperty({
        example: ["Hola a todos", "Esta landing es", "de prueba"],
        description: "Lista de secciones o contenido de la landing page"
    })
    @IsArray({ message: "El contenido debe ser un array de strings" })
    @ArrayNotEmpty({ message: "El contenido no puede estar vacío" })
    @IsString({ each: true, message: "Cada elemento del contenido debe ser un string válido" })
    contenido: string[];

    @ApiProperty({
        example: "ACTIVO",
        enum: EstadoGenerico,
        description: "Estado de la landing page (opcional)"
    })
    @IsOptional()
    @IsEnum(EstadoGenerico, {
        message:
            'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
    })
    estado: EstadoGenerico;

    @ApiProperty({ 
        example: "6792877e2942e670016454de",
        description: "ID del planeta asociado"
    })
    @IsString({ message: "El ID del planeta debe ser un string válido" })
    @IsNotEmpty({ message: "El ID del planeta no puede estar vacío" })
    @IsMongoId({ message: "El ID del planeta debe ser un ObjectId válido" })
    planetaId: string;

    @ApiProperty({
        example: "#FF5733",
        description: "Color principal en formato hexadecimal (opcional)"
    })
    @IsOptional()
    @IsHexColor({ message: "El color debe ser un código hexadecimal válido (#RRGGBB o #RGB)." })
    color?: string;

    @ApiProperty({
        example: "https://media-public.canva.com/uW7NI/MAD9dCuW7NI/1/tl.png",
        description: "URL de la imagen representativa (opcional)"
    })
    @IsOptional()
    @IsUrl(
        { require_tld: true },
        { message: "El valor de imagenUrl debe ser una URL válida" }
    )
    imagenUrl?: string;
}
