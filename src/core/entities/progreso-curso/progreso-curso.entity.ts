import { EstadoProgresoCurso } from '@prisma/client';

export class ProgresoCurso {
  constructor(
    public id: string,
    public idUsuario: number,
    public idCuentaAsociada: number | null,
    public idCurso: string,
    public porcentaje: number,
    public estado: EstadoProgresoCurso,
    public fechaCompletado: Date | null,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
  ) {}
}
