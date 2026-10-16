export type EstadoModuloResumen = 'SIN_INICIAR' | 'EN_PROGRESO' | 'COMPLETADO';

export interface ModuloResumen {
  moduloId: string;
  nombre: string;
  orden: number;
  estado: EstadoModuloResumen;
  porcentajeVideo: number;
  quiz: { puntaje: number | null; total: number | null; aprobado: boolean } | null;
  pistasUsadas: number;
  ultimaActividad: Date | null;
  completadoEn: Date | null;
}

export interface CursoResumen {
  cursoId: string;
  cursoNombre: string;
  modulosCompletados: number;
  totalModulos: number;
  porcentaje: number;
  modulos: ModuloResumen[];
}

export interface EstudianteResumen {
  idusuario: number;
  codigo: string;
  alias: string | null;
  tipocuenta: string;
  ultimaActividad: Date | null;
  cursos: CursoResumen[];
}

export interface FamiliaResumen {
  id: number;
  codigo: string;
  nombre: string | null;
  padre: { id: number; codigo: string; username: string };
  estudiantes: EstudianteResumen[];
}

export interface ResumenProgreso {
  kpis: {
    totalFamilias: number;
    familiasActivas: number;
    estudiantesConProgreso: number;
    modulosCompletados: number;
    periodoActividad: { desde: Date; hasta: Date };
  };
  familias: FamiliaResumen[];
}
