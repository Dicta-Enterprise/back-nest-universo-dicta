import { aplicarEvento, EventoProgreso } from './progreso-modulo.service';
import { ProgresoModulo } from 'src/core/entities/progreso-modulo/progreso-modulo.entity';

const base: Omit<EventoProgreso, 'tipo'> = {
  usuarioId: 7,
  cursoId: '64fd1c2f9a25d8e3f41b9c7a',
  moduloId: '64fd1c2f9a25d8e3f41b9c7b',
};

describe('aplicarEvento', () => {
  it('crea el resumen en EN_PROGRESO con el primer evento', () => {
    const r = aplicarEvento(null, { ...base, tipo: 'initialized' });
    expect(r.estado).toBe('EN_PROGRESO');
    expect(r.porcentajeVideo).toBe(0);
  });

  it('el porcentaje de video solo sube', () => {
    let r = aplicarEvento(null, { ...base, tipo: 'progressed', resultado: { porcentaje: 75 } });
    r = aplicarEvento(r, { ...base, tipo: 'progressed', resultado: { porcentaje: 25 } });
    expect(r.porcentajeVideo).toBe(75);
  });

  it('guarda el puntaje del último intento del quiz', () => {
    let r = aplicarEvento(null, { ...base, tipo: 'failed', resultado: { puntaje: 2, total: 5 } });
    expect(r.quizAprobado).toBe(false);
    r = aplicarEvento(r, { ...base, tipo: 'passed', resultado: { puntaje: 4, total: 5 } });
    expect(r).toMatchObject({ quizAprobado: true, quizPuntaje: 4, quizTotal: 5 });
  });

  it('suma una pista por evento interacted', () => {
    let r = aplicarEvento(null, { ...base, tipo: 'interacted' });
    r = aplicarEvento(r, { ...base, tipo: 'interacted' });
    expect(r.pistasUsadas).toBe(2);
  });

  it('no cuenta dos veces un evento con el mismo eventoId', () => {
    let r = aplicarEvento(null, { ...base, tipo: 'interacted', eventoId: 'a1' });
    r = aplicarEvento(r, { ...base, tipo: 'interacted', eventoId: 'a1' });
    expect(r.pistasUsadas).toBe(1);
  });

  it('completed marca COMPLETADO y un evento posterior no lo regresa', () => {
    let r: ProgresoModulo = aplicarEvento(null, { ...base, tipo: 'completed' });
    const cierre = r.completadoEn;
    r = aplicarEvento(r, { ...base, tipo: 'resumed' });
    expect(r.estado).toBe('COMPLETADO');
    expect(r.completadoEn).toBe(cierre);
  });
});
