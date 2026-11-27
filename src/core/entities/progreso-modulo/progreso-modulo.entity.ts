export type EstadoProgreso = 'EN_PROGRESO' | 'COMPLETADO';

export class ProgresoModulo {
  constructor(
    public usuarioId: number,
    public cursoId: string,
    public moduloId: string,
    public estado: EstadoProgreso,
    public porcentajeVideo: number,
    public pistasUsadas: number,
    public eventosProcesados: string[],
    public ultimaActividad: Date,
    public quizPuntaje?: number | null,
    public quizTotal?: number | null,
    public quizAprobado?: boolean | null,
    public completadoEn?: Date | null,
    public id?: string,
  ) {}
}
