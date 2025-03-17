import { HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CustomError } from "src/shared/class/Error.Class";

const prisma = new PrismaClient();

export async function verificarNombreUnico(nombre: string, excludeIdiomaId?: string): Promise<void> {
    const existingIdioma = await prisma.idioma.findFirst({
        where: {
            nombre,
            id: excludeIdiomaId ? { not: excludeIdiomaId } : undefined,
        }
    });

    if (existingIdioma) {
        throw new CustomError(
            'Ya existe un idioma con ese nombre',
            'Conflict',
            HttpStatus.CONFLICT
        );
    }
}

export async function ExistenciaIdioma(id: string): Promise<void> {
    const existingIdioma = await prisma.idioma.findUnique({
        where: { id }
    });

    if (!existingIdioma) {
        throw new CustomError(
            `No se encontró el idioma con el ID: "${id}".`,
            'Not Found',
            HttpStatus.NOT_FOUND
        );
    }
}
