
export class ItemColores {
  constructor(
    public id: string,
    public color: string,
    public descripcion?: string,
  ) {}

  static fromPrisma(data: ItemColores): ItemColores {
    return new ItemColores(
      data.id,
      data.color,
      data.descripcion,
    );
  }
}
