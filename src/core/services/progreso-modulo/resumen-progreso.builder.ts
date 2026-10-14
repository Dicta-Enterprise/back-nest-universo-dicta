import { Curso } from 'src/core/entities/curso/curso.entity';
import { ProgresoModulo } from 'src/core/entities/progreso-modulo/progreso-modulo.entity';
import {
  CursoResumen,
  EstudianteResumen,
  ModuloResumen,
  ResumenProgreso,
} from 'src/core/entities/progreso-modulo/resumen-progreso';
import { FamiliaAuth } from 'src/core/services/auth-api/auth-api.service';

const maxFecha = (a: Date | null, b: Date): Date => (a && a > b ? a : b);

function resumirCurso(curso: Curso, progresosDelEstudiante: ProgresoModulo[]): CursoResumen {
  const modulos: ModuloResumen[] = [...(curso.modulos ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .map((modulo) => {
      const p = progresosDelEstudiante.find((x) => x.moduloId === modulo.id);
      return {
        moduloId: modulo.id,
        nombre: modulo.nombre,
        orden: modulo.orden,
        estado: p ? p.estado : 'SIN_INICIAR',
        porcentajeVideo: p?.porcentajeVideo ?? 0,
        quiz:
          p && p.quizAprobado !== null && p.quizAprobado !== undefined
            ? { puntaje: p.quizPuntaje ?? null, total: p.quizTotal ?? null, aprobado: p.quizAprobado }
            : null,
        pistasUsadas: p?.pistasUsadas ?? 0,
        ultimaActividad: p?.ultimaActividad ?? null,
        completadoEn: p?.completadoEn ?? null,
      };
    });

  const modulosCompletados = modulos.filter((m) => m.estado === 'COMPLETADO').length;
  return {
    cursoId: curso.id,
    cursoNombre: curso.nombre,
    modulosCompletados,
    totalModulos: modulos.length,
    // Supuesto pendiente de confirmar con Andrea: la barra cuenta módulos completados, no el parcial del video.
    porcentaje: modulos.length ? Math.round((modulosCompletados / modulos.length) * 100) : 0,
    modulos,
  };
}

/**
 * Junta lo que viene de auth (familias y miembros), el progreso guardado y el catálogo de cursos
 * en la respuesta que pintan los dashboards. No toca la base de datos.
 */
export function construirResumen(
  familias: FamiliaAuth[],
  progresos: ProgresoModulo[],
  cursos: Curso[],
  periodo: { desde: Date; hasta: Date },
): ResumenProgreso {
  const cursosPorId = new Map(cursos.map((c) => [c.id, c]));
  let familiasActivas = 0;
  let estudiantesConProgreso = 0;
  let modulosCompletados = 0;

  const familiasResumen = familias.map((familia) => {
    let activa = false;

    const estudiantes: EstudianteResumen[] = familia.miembros.map((miembro) => {
      const propios = progresos.filter((p) => p.usuarioId === miembro.idusuario);
      let ultimaActividad: Date | null = null;

      for (const p of propios) {
        ultimaActividad = maxFecha(ultimaActividad, p.ultimaActividad);
        if (p.ultimaActividad >= periodo.desde && p.ultimaActividad <= periodo.hasta) {
          activa = true;
        }
        if (p.estado === 'COMPLETADO') modulosCompletados += 1;
      }
      if (propios.length) estudiantesConProgreso += 1;

      const idsCursos = [...new Set(propios.map((p) => p.cursoId))];
      const cursosEstudiante = idsCursos
        .map((id) => cursosPorId.get(id))
        .filter((c): c is Curso => !!c)
        .map((c) => resumirCurso(c, propios.filter((p) => p.cursoId === c.id)));

      return {
        idusuario: miembro.idusuario,
        alias: miembro.alias,
        tipocuenta: miembro.tipocuenta,
        ultimaActividad,
        cursos: cursosEstudiante,
      };
    });

    if (activa) familiasActivas += 1;
    return {
      id: familia.id,
      nombre: familia.nombre,
      padre: { id: familia.padre.id, username: familia.padre.username },
      estudiantes,
    };
  });

  return {
    kpis: {
      totalFamilias: familias.length,
      familiasActivas,
      estudiantesConProgreso,
      modulosCompletados,
      periodoActividad: periodo,
    },
    familias: familiasResumen,
  };
}
