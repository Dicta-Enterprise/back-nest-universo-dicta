import { EstadoProgresoCurso } from '@prisma/client';
import { ProgresoCurso } from 'src/core/entities/progreso-curso/progreso-curso.entity';

export interface DatosProgresoCurso {
  idUsuario: number;
  idCuentaAsociada: number | null;
  idCurso: string;
  porcentaje: number;
  estado: EstadoProgresoCurso;
  fechaCompletado: Date | null;
}

export interface ProgresoCursoRepository {
  findByTitularYCurso(
    idUsuario: number,
    idCuentaAsociada: number | null,
    idCurso: string,
  ): Promise<ProgresoCurso | null>;
  findAllByUsuario(idUsuario: number): Promise<ProgresoCurso[]>;
  findAllByCuentaAsociada(idCuentaAsociada: number): Promise<ProgresoCurso[]>;
  guardar(datos: DatosProgresoCurso): Promise<ProgresoCurso>;
}
