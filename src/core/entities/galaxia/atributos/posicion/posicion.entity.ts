export class Posicion {
  constructor(
    public id: string,
    public x: number,
    public y: number,
    public itemId?: string,
  ) {}

  static fromPrisma(data: Posicion): Posicion {
    return new Posicion(data.id, data.x, data.y, data.itemId);
  }
}
