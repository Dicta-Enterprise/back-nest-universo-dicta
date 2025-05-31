export class Profesor {
  constructor(
    public id: string,
    public nombre: string,
    public dni: string,
    public apellido_paterno: string,
    public apellido_materno: string,
    public estado_p: boolean,
    public email: string,
    public cursos: string[],
  ) {}

  public cambiarEstado(): void {
    if (this.estado_p){
      this.estado_p = false;
    }else{
      this.estado_p = true;
    }
  }

  static fromPrismaList(data: any[]): Profesor[] {
    return data.map((item) => Profesor.fromPrisma(item));
  }

  static fromPrisma(data: any): Profesor {
    return new Profesor(data.id, data.nombre, data.dni, data.apellido_paterno, data.apellido_materno, data.estado_p, data.email, data.cursos);
  }
}
