export class Idioma {
    constructor(
      public id: string,
      public nombre: string,
      public estado: boolean,
    ) {}
  
    public desactivar(): void {
      this.estado = false;
    }
  
    static fromPrismaList(data: any[]): Idioma[] {
      return data.map((item) => Idioma.fromPrisma(item));
    }
  
    static fromPrisma(data: any): Idioma {
      return new Idioma(
        data.id,
        data.nombre,
        data.estado,
      );
    }
  }
  