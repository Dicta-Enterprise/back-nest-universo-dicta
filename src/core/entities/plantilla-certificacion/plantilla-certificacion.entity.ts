import { EstadoPlantilla, TipoCertificacion } from '@prisma/client';

export class PlantillaCertificacion {
  constructor(
    public id: string,
    public nombre: string,
    public tipoCertificacion: TipoCertificacion,
    public urlPlantilla: string,
    public configuracion: Record<string, unknown>,
    public estado: EstadoPlantilla,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public descripcion?: string,
  ) {}
}
