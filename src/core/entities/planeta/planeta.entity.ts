import { EstadoGenerico } from '@prisma/client';
import { Galaxia } from '../galaxia/galaxia.entity';
import { InfoPlaneta } from './infoPlaneta/infoPlaneta.entity';
import { Peligro } from './peligro/peligro.entity';
import { Beneficio } from './beneficio/beneficio.entity';

export class Planeta {
  constructor(
    public id: string,
    public nombre: string,
    public grupo: string,
    public tema: string,
    public textura: string,
    public url: string,
    public imagenResumen: string,
    public imagenBeneficios: string,
    public resumenCurso: string,
    public estado: EstadoGenerico,
    public info: InfoPlaneta,
   public peligros: Peligro[],         
    public beneficios: Beneficio[], 
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public galaxiaId: string,
    public galaxia?: Galaxia | null,
  ) {}

  static fromPrismaList(data: Planeta[]): Planeta[] {
    return data.map((item) => Planeta.fromPrisma(item));
  }

  static fromPrisma(data: Planeta): Planeta {
    return new Planeta(
      data.id,
      data.nombre,
      data.grupo,
      data.tema,
      data.textura,
      data.url,
      data.imagenResumen,
      data.imagenBeneficios,
      data.resumenCurso,
      data.estado,
      data.info ? InfoPlaneta.fromPrisma(data.info) : null,
      data.peligros ? data.peligros.map((p: Peligro) => Peligro.fromPrisma(p)) : [],       
      data.beneficios ? data.beneficios.map((b: Beneficio) => Beneficio.fromPrisma(b)) : [], 
      data.fechaCreacion,
      data.fechaActualizacion,
      data.galaxiaId,
      data.galaxia ? Galaxia.fromPrisma(data.galaxia) : null,
    );
  }
}
