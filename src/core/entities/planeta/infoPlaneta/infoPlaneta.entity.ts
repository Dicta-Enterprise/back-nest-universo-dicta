export class InfoPlaneta {
  constructor(
    public tipoRiesgo: string,
    public tamano: string,
    public composicion: string,
    public riesgo: string,
    public nivel: string,
    public ambiente: string,
    public temperatura: string,
    public villano: string,
  ) {}

  static fromPrisma(data: InfoPlaneta): InfoPlaneta {
    return new InfoPlaneta(
      data.tipoRiesgo,
      data.tamano,
      data.composicion,
      data.riesgo,
      data.nivel,
      data.ambiente,
      data.temperatura,
      data.villano,
    );
  }
}
