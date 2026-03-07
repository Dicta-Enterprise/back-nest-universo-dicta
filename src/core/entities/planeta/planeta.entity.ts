import { EstadoGenerico } from '@prisma/client';
import { InfoPlaneta } from './infoPlaneta/infoPlaneta.entity';
import { Peligro } from './peligro/peligro.entity';
import { Beneficio } from './beneficio/beneficio.entity';

export class Planeta {
  constructor(
    public id: string,
    public nombre: string,
    public categoria: string,
    public galaxia: string,
    public textura: string,
    public url: string,
    public imagenResumen: string,
    public resumenCurso: string,
    public estado: EstadoGenerico,
    public galaxiaId: string,
    public info: InfoPlaneta,
    public peligros: Peligro[],
    public beneficios: Beneficio[],

  ) {}
}
