
export class ItemColores {
  constructor(
    public id: string,
    public color: string,
    public descripcion?: string,
  ) {}

  static fromPrisma(data: any): ItemColores {
    return new ItemColores(
      data.id,
      data.color,
      data.descripcion,
    );
  }
}
