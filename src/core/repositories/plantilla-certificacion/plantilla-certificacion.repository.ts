import { EstadoPlantilla, TipoCertificacion } from '@prisma/client';
import { PlantillaCertificacion } from 'src/core/entities/plantilla-certificacion/plantilla-certificacion.entity';

export interface FiltrosPlantillaCertificacion {
  estado?: EstadoPlantilla;
  tipoCertificacion?: TipoCertificacion;
}

export interface PlantillaCertificacionRepository {
  findById(id: string): Promise<PlantillaCertificacion | null>;
  findActivaByNombre(nombre: string, excludeId?: string): Promise<PlantillaCertificacion | null>;
  findActivaByTipo(tipo: TipoCertificacion, excludeId?: string): Promise<PlantillaCertificacion | null>;
  findAll(filtros?: FiltrosPlantillaCertificacion): Promise<PlantillaCertificacion[]>;
  save(plantilla: PlantillaCertificacion): Promise<PlantillaCertificacion>;
  update(id: string, plantilla: Partial<PlantillaCertificacion>): Promise<PlantillaCertificacion>;
  delete(id: string): Promise<void>;
  tieneCertificacionesAsociadas(id: string): Promise<boolean>;
}
