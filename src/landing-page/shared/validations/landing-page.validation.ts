import { HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CustomError } from "src/shared/class/Error.Class";

// Aqui realicé mis validaciones personalizadas 
// No las llamo en los servicios , en los servicios solo se maneja la logica 
// para que cumpla con la funcionalidad del Mantenedor

// Por esta razon cree decoradoreas que puse en el controller, antes de que lleguen a los servicios.
// Revisar shared > decorators
const prisma = new PrismaClient();

// Verifica si un planeta existe en la base de datos antes de asignarlo a una landing page
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

// Verifica que un planeta no esté asignado a otra landing page activa
export async function verificarPlanetaNoAsignado(planetaId: string, excludeLandingId?: string): Promise<void> {
    const existingLanding = await prisma.landingPage.findFirst({
        where: {
            planetaId,
            id: excludeLandingId ? { not: excludeLandingId } : undefined,
            estado: { not: "INACTIVO" } // Considera solo landings activas
        },
    });

    if (existingLanding) {
        throw new CustomError(
            `El planeta con ID ${planetaId} ya está asignado a otra landing page activa`,
            'Conflict',
            HttpStatus.CONFLICT
        );
    }
}

// Verifica que el título de la landing page sea único antes de crear o actualizar
export async function verificarTituloUnico(titulo: string, excludeLandingId?: string): Promise<void> {
    const existingLanding = await prisma.landingPage.findFirst({
        where: {
            titulo,
            id: excludeLandingId ? { not: excludeLandingId } : undefined, // Excluye una landing específica si se pasa como parámetro
        }
    });

    if (existingLanding) {
        throw new CustomError(
            'Ya existe una Landing Page con ese titulo',
            'Conflict',
            HttpStatus.CONFLICT
        );
    }
}

// Verifica si una Landing Page existe en la base de datos antes de actualizar o eliminar
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