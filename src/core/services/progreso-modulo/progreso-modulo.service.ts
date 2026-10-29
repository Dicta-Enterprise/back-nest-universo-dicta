import { Inject, Injectable } from '@nestjs/common';
import { PROGRESO_MODULO_REPOSITORY } from '@constants/constants';
import { ProgresoModulo } from 'src/core/entities/progreso-modulo/progreso-modulo.entity';
import { ProgresoModuloRepository } from 'src/core/repositories/progreso-modulo/progreso-modulo.repository';
import { VerboXapi } from 'src/application/dto/xapi/enviar-statement.dto';

const MAX_EVENTOS_GUARDADOS = 200;

export interface EventoProgreso {
  usuarioId: number;
  cursoId: string;
  moduloId: string;
  tipo: VerboXapi;
  eventoId?: string;
  resultado?: Record<string, unknown>;
}

const numeroOUndefined = (valor: unknown): number | undefined =>
  typeof valor === 'number' && Number.isFinite(valor) ? valor : undefined;

/**
 * Calcula cómo queda el resumen de un módulo después de un evento.
 * Es una función pura (no toca la base de datos) para poder probarla fácil.
 */
export function aplicarEvento(
  actual: ProgresoModulo | null,
  evento: EventoProgreso,
  ahora: Date = new Date(),
): ProgresoModulo {
  const progreso =
    actual ??
    new ProgresoModulo(evento.usuarioId, evento.cursoId, evento.moduloId, 'EN_PROGRESO', 0, 0, [], ahora);

  // Evento repetido (p. ej. la app lo reenvía tras estar sin internet): no se vuelve a contar.
  if (evento.eventoId && progreso.eventosProcesados.includes(evento.eventoId)) {
    return progreso;
  }

  progreso.ultimaActividad = ahora;

  switch (evento.tipo) {
    case 'progressed': {
      const porcentaje = numeroOUndefined(evento.resultado?.porcentaje);
      if (porcentaje !== undefined) {
        // El porcentaje de video solo sube, nunca baja.
        progreso.porcentajeVideo = Math.max(progreso.porcentajeVideo, Math.min(100, Math.round(porcentaje)));
      }
      break;
    }
    case 'passed':
    case 'failed':
      progreso.quizAprobado = evento.tipo === 'passed';
      progreso.quizPuntaje = numeroOUndefined(evento.resultado?.puntaje) ?? null;
      progreso.quizTotal = numeroOUndefined(evento.resultado?.total) ?? null;
      break;
    case 'interacted':
      progreso.pistasUsadas += 1;
      break;
    case 'completed':
      progreso.estado = 'COMPLETADO';
      progreso.completadoEn = progreso.completadoEn ?? ahora;
      break;
    // initialized, resumed, suspended, mastered: solo cambian la última actividad.
  }

  if (evento.eventoId) {
    progreso.eventosProcesados = [...progreso.eventosProcesados, evento.eventoId].slice(-MAX_EVENTOS_GUARDADOS);
  }

  return progreso;
}

@Injectable()
export class ProgresoModuloService {
  constructor(
    @Inject(PROGRESO_MODULO_REPOSITORY)
    private readonly repository: ProgresoModuloRepository,
  ) {}

  async registrarEvento(evento: EventoProgreso): Promise<ProgresoModulo> {
    const actual = await this.repository.find(evento.usuarioId, evento.cursoId, evento.moduloId);
    const actualizado = aplicarEvento(actual, evento);
    return this.repository.upsert(actualizado);
  }
}
