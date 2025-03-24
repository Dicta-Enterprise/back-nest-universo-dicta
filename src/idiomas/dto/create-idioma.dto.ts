import { ApiProperty } from "@nestjs/swagger";
import { EstadoGenerico } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateIdiomaDto {
    @ApiProperty({
        example: "Nuevo Idioma",
        description: "Nombre del Idioma"
      })
    @IsString({ message: 'El nombre debe ser un string válido' })
    @IsNotEmpty({ message: 'El nombre del idioma no puede estar vacío.' })
    @Transform(({ value }) => value.trim())
    nombre: string;

    @ApiProperty({
        example: "Des. Idioma",
        description: "Descripción del Idioma"
      })
    @IsString({ message: "La descripción debe ser un string válido" })
    @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
    descripcion: string;

    @ApiProperty({
        example: "ACTIVO",
        enum: EstadoGenerico,
        description: "Estado del Idioma (opcional)"
      })
    @IsOptional()
    @IsEnum(EstadoGenerico, {
        message:
            'El estado proporcionado no es válido. Valores permitidos: ACTIVO, INACTIVO, PENDIENTE, ELIMINADO, DESHABILITADO.',
    })
    estado: EstadoGenerico;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    fechaCreacion: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    fechaActualizacion: Date;
}