export class ItemImagen {
  constructor(
    public file: File,
    public cateogria: string,
    public url: string,
  ) {}
  static fromPrismaList(data: any[]): ItemImagen[] {
    return data.map((item) => ItemImagen.fromPrisma(item));
  }

  static fromPrisma(data: any): ItemImagen {
    return new ItemImagen(data.file, data.cateogria, data.url);
  }
}
