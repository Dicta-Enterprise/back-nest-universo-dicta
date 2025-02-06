import { HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CustomError } from "src/shared/class/Error.Class";

const prisma = new PrismaClient();

export async function verificarExistenciaPlaneta(planetaId: string): Promise<void> {
    const planeta = await prisma.planeta.findUnique({ where: { id: planetaId } });

    if (!planeta) {
        throw new CustomError(
            `El planeta con ID ${planetaId} no existe`,
            'Conflict',
            HttpStatus.BAD_REQUEST
        )
    }
}

export async function verificarPlanetaNoAsignado(planetaId: string, excludeLandingId?: string): Promise<void> {
    const existingLanding = await prisma.landingPage.findFirst({
        where: {
            planetaId,
            id: excludeLandingId ? { not: excludeLandingId } : undefined
        },
    });

    if (existingLanding) {
        throw new CustomError(
            `El planeta con ID ${planetaId} ya esta asignado a otra landing page`,
            'Conflict',
            HttpStatus.CONFLICT
        );
    }
}

export async function verificarTituloUnico(titulo: string): Promise<void> {
    const existingLanding = await prisma.landingPage.findUnique({ where: { titulo } });

    if (existingLanding) {
        throw new CustomError(
            'Ya existe una Landing Page con ese titulo',
            'Conflict',
            HttpStatus.CONFLICT
        );
    }
}

export async function ExistenciaLandingPage(id: string): Promise<void> {
    const existingLanding = await prisma.landingPage.findUnique({ where: { id } });

    if (!existingLanding) {
        throw new CustomError(
            `No se encontró la landing page con el ID: "${id}".`,
            'Not Found',
            HttpStatus.NOT_FOUND
        );
    }
}

