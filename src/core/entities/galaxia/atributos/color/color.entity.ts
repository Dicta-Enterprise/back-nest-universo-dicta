export class Color {
  constructor(
    public id: string,
    public type: string,
    public value: string,
    public itemId?: string,
  ) {}

  static fromPrisma(data: Color): Color {
    return new Color(data.id, data.type, data.value, data.itemId);
  }

  static fromPrismaList(data: Color[]): Color[] {
    return data.map((c) => Color.fromPrisma(c));
  }
}
