export class ItemImagen {
  constructor(
    public file: File,
    public cateogria: string,
    public url: string,
  ) {}
  static fromPrismaList(data: ItemImagen[]): ItemImagen[] {
    return data.map((item) => ItemImagen.fromPrisma(item));
  }

  static fromPrisma(data: ItemImagen): ItemImagen {
    return new ItemImagen(data.file, data.cateogria, data.url);
  }
}
