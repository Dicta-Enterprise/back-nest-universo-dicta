import { PlantillaCertificacion as PrismaPlantillaCertificacion } from '@prisma/client';
import { PlantillaCertificacion } from 'src/core/entities/plantilla-certificacion/plantilla-certificacion.entity';

export interface PlantillaCertificacionFactory {
  crearDesdePrisma(prisma: PrismaPlantillaCertificacion): PlantillaCertificacion;
}

export class DefaultPlantillaCertificacionFactory
  implements PlantillaCertificacionFactory
{
  crearDesdePrisma(prisma: PrismaPlantillaCertificacion): PlantillaCertificacion {
    return new PlantillaCertificacion(
      prisma.id,
      prisma.nombre,
      prisma.tipoCertificacion,
      prisma.urlPlantilla,
      prisma.configuracion as unknown as Record<string, unknown>,
      prisma.estado,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
      prisma.descripcion ?? undefined,
    );
  }
}
