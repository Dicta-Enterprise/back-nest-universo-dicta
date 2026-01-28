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
}
