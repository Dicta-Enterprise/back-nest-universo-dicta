import { PrismaClient } from '@prisma/client';
import { CustomError } from 'src/shared/class/Error.Class';
import { HttpStatus } from '@nestjs/common';

const prisma = new PrismaClient();

export async function verificarExistenciaGalaxia(galaxiaId: string): Promise<void> {
  const galaxia = await prisma.galaxia.findUnique({ where: { id: galaxiaId } });
  if (!galaxia) {
    throw new CustomError(
      'La ID de galaxia que está colocando no existe',
      'Conflict',
      HttpStatus.BAD_REQUEST
    );
  }
}

export async function verificarGalaxiaSinAsignar(galaxiaId: string, excludeplanetaId?: string): Promise<void> {
  const existingPlaneta = await prisma.planeta.findFirst({
    where: {
      galaxiaId,
      estado: 'ACTIVO',
      id: excludeplanetaId ? { not: excludeplanetaId } : undefined,
    },
  });
  if (existingPlaneta) {
    throw new CustomError(
      `La galaxia con ID ${galaxiaId} ya tiene un planeta asignado`,
      'Conflict',
      HttpStatus.CONFLICT
    );
  }
}

export async function verificarNombreUnico(nombre: string, excludeplanetaId?: string): Promise<void> {
  const existingPlaneta = await prisma.planeta.findFirst({
    where: {
      nombre,
      id: excludeplanetaId ? { not: excludeplanetaId } : undefined,
    },
  });

  if (existingPlaneta) {
    throw new CustomError(
      'Ya existe un planeta con ese nombre',
      'Conflict',
      HttpStatus.CONFLICT
    );
  }
}

export async function verificarExistenciaPlaneta(id: string): Promise<void> {
  const planeta = await prisma.planeta.findUnique({ where: { id } });
  if (!planeta) {
    throw new CustomError(
      'No se encontró el planeta seleccionado',
      'Not Found',
      HttpStatus.NOT_FOUND
    );
  }
}

export async function verificarPlanetaActivo(id: string): Promise<void> {
  const planeta = await prisma.planeta.findUnique({ where: { id, estado: 'ACTIVO' } });
  if (!planeta) {
    throw new CustomError(
      'El planeta seleccionado no está activo',
      'Not Found',
      HttpStatus.NOT_FOUND
    );
  }
}
