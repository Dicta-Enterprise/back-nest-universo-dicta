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
}
