import { EstadoGenerico } from '@prisma/client';
import { Galaxia } from '../galaxia/galaxia.entity';
import { InfoPlaneta } from './infoPlaneta/infoPlaneta.entity';

export class Planeta {
  constructor(
    public id: string,
    public grupo: string,
    public nombre: string,
    public tema: string,
    public textura: string,
    public url: string,
    public estado: EstadoGenerico,
    public info: InfoPlaneta,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public galaxia: Galaxia,
    public galaxiaId: string,
  ) {}

  static fromPrismaList(data: any[]): Planeta[] {
    return data.map((item) => Planeta.fromPrisma(item));
  }

  static fromPrisma(data: any): Planeta {
    return new Planeta(
      data.id,
      data.grupo,
      data.nombre,
      data.tema,
      data.textura,
      data.url,
      data.estado,
      InfoPlaneta.fromPrisma(data.info),
      data.fechaCreacion,
      data.fechaActualizacion,
      data.galaxia ? Galaxia.fromPrisma(data.galaxia) : null,
      data.galaxiaId,
    );
  }
}
