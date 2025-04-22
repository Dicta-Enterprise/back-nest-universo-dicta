import { EstadoGenerico } from '@prisma/client';

export class Galaxia {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public imagen: string,
    public estado: EstadoGenerico,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
  ) {}


    static fromPrismaList(data: any[]): Galaxia[] {
        return data.map((item) => Galaxia.fromPrisma(item));
    }


    static fromPrisma(data: any): Galaxia {
        return new Galaxia(
            data.id,
            data.nombre,
            data.descripcion,
            data.imagen,
            data.estado,
            data.fechaCreacion,
            data.fechaActualizacion,
        );
    }


}
