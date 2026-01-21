export class ItemImagenLanding {
  constructor(
    public id: string,
    public url: string,
    public descripcion?: string,
  ) {}

  static fromPrisma(data: ItemImagenLanding): ItemImagenLanding {
    return new ItemImagenLanding(data.id, data.url, data.descripcion);
  }
}
