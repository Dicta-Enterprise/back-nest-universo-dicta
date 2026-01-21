export class VectorGalaxia {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  static fromPrisma(data: VectorGalaxia): VectorGalaxia | null {
    if (!data) return null;
    return new VectorGalaxia(data.x, data.y, data.z);
  }
}
