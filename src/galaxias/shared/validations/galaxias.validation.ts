import { HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CustomError } from "src/shared/class/Error.Class";

const prisma = new PrismaClient();

export async function verificarNombreUnico(nombre: string, excludegalaxiaId?: string): Promise<void> {
    const existingGalaxia = await prisma.galaxia.findFirst({
        where: {
            nombre,
            id: excludegalaxiaId ? { not: excludegalaxiaId } : undefined,
        }
    });

    if (existingGalaxia) {
        throw new CustomError(
            'Ya existe una galaxia con ese nombre',
            'Conflict',
            HttpStatus.CONFLICT
        );
    }
}

export async function ExistenciaGalaxia(id: string): Promise<void> {
    const existingGalaxia = await prisma.galaxia.findUnique({
        where: { id }
    });

    if (!existingGalaxia) {
        throw new CustomError(
            `No se encontró la galaxia con el ID: "${id}".`,
            'Not Found',
            HttpStatus.NOT_FOUND
        );
    }
}

