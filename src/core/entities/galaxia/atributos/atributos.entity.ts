import { Posicion } from './posicion/posicion.entity';
import { Color } from './color/color.entity';

export class Atributos {
  constructor(
    public id: string,
    public galaxiaId: string,
    public posicion: Posicion | null,
    public colores: Color[],
  ) {}

  static fromPrisma(data: any): Atributos {
    return new Atributos(
      data.id,
      data.galaxiaId,
      data.posicion ? Posicion.fromPrisma(data.posicion) : null,
      data.colores ? Color.fromPrismaList(data.colores) : [],
    );
  }

  static fromPrismaList(data: any[]): Atributos[] {
  return data.map((item) => Atributos.fromPrisma(item));  }
}
