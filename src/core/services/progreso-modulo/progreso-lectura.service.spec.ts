import { ProgresoLecturaService } from './progreso-lectura.service';
import { construirResumen } from './resumen-progreso.builder';
import { ProgresoModulo } from 'src/core/entities/progreso-modulo/progreso-modulo.entity';
import { Curso, ModuloCurso } from 'src/core/entities/curso/curso.entity';
import { FamiliaAuth } from 'src/core/services/auth-api/auth-api.service';

jest.mock('src/config/envs', () => ({ envs: {} }));

const periodo = { desde: new Date('2026-10-01'), hasta: new Date('2026-10-08') };

const familia = (id: number, idpadre: number, idsHijos: number[]): FamiliaAuth => ({
  id,
  codigo: `FAM-00${id}`,
  nombre: id === 1 ? 'Familia Mendoza' : null,
  padre: { id: idpadre, codigo: `USR-P-0${String(idpadre).padStart(2, '0')}`, username: `padre${idpadre}`, email: `p${idpadre}@x.co` },
  miembros: idsHijos.map((idusuario) => ({
    idcuenta: idusuario,
    idusuario,
    codigo: `USR-N-0${String(idusuario).padStart(2, '0')}`,
    alias: `hijo${idusuario}`,
    tipocuenta: 'NINO',
    estado: 'ACTIVA',
  })),
});

const curso = {
  id: 'c1',
  nombre: 'Salud Emocional',
  modulos: [new ModuloCurso('m1', 'Uno', 'v1', 1), new ModuloCurso('m2', 'Dos', 'v2', 2)],
} as unknown as Curso;

const progreso = (usuarioId: number, moduloId: string, estado: 'EN_PROGRESO' | 'COMPLETADO', fecha: string) =>
  new ProgresoModulo(usuarioId, 'c1', moduloId, estado, 50, 1, [], new Date(fecha), 4, 5, true);

describe('construirResumen', () => {
  const familias = [familia(1, 5, [10, 11]), familia(2, 6, [20])];
  const progresos = [
    progreso(10, 'm1', 'COMPLETADO', '2026-10-05'),
    progreso(10, 'm2', 'EN_PROGRESO', '2026-10-06'),
    progreso(20, 'm1', 'EN_PROGRESO', '2026-09-01'), // fuera del periodo
  ];
  const r = construirResumen(familias, progresos, [curso], periodo);

  it('calcula el porcentaje por módulos completados (1 de 2 = 50%)', () => {
    const curso10 = r.familias[0].estudiantes[0].cursos[0];
    expect(curso10).toMatchObject({ modulosCompletados: 1, totalModulos: 2, porcentaje: 50 });
  });

  it('incluye los códigos legibles de la familia, el padre y los estudiantes', () => {
    expect(r.familias[0]).toMatchObject({ codigo: 'FAM-001', padre: { codigo: 'USR-P-005' } });
    expect(r.familias[0].estudiantes.map((e) => e.codigo)).toEqual(['USR-N-010', 'USR-N-011']);
  });

  it('un estudiante sin eventos queda sin cursos', () => {
    expect(r.familias[0].estudiantes[1].cursos).toEqual([]);
  });

  it('marca módulos sin eventos como SIN_INICIAR y trae el puntaje del quiz', () => {
    const [m1, m2] = r.familias[1].estudiantes[0].cursos[0].modulos;
    expect(m1.estado).toBe('EN_PROGRESO');
    expect(m2.estado).toBe('SIN_INICIAR');
    expect(m1.quiz).toEqual({ puntaje: 4, total: 5, aprobado: true });
  });

  it('KPIs: solo cuenta como activa la familia con eventos dentro del periodo', () => {
    expect(r.kpis).toMatchObject({
      totalFamilias: 2,
      familiasActivas: 1,
      estudiantesConProgreso: 2,
      modulosCompletados: 1,
    });
  });
});

describe('ProgresoLecturaService (filtro por rol)', () => {
  const todas = [familia(1, 5, [10]), familia(2, 6, [20])];
  const authApi = {
    listarFamilias: jest.fn().mockResolvedValue(todas),
    obtenerFamiliaPorPadre: jest.fn(),
  };
  const progresoRepo = { findByUsuarios: jest.fn().mockResolvedValue([]) };
  const cursoRepo = { findAllActive: jest.fn().mockResolvedValue([]) };
  type Dependencias = ConstructorParameters<typeof ProgresoLecturaService>;
  const service = new ProgresoLecturaService(
    authApi as unknown as Dependencias[0],
    progresoRepo as unknown as Dependencias[1],
    cursoRepo as unknown as Dependencias[2],
  );

  beforeEach(() => jest.clearAllMocks());

  it('el administrador (idrol 1) ve todas las familias', async () => {
    const r = await service.obtenerResumen({ sub: 1, idrol: 1 }, periodo);
    expect(authApi.listarFamilias).toHaveBeenCalled();
    expect(r.familias).toHaveLength(2);
    expect(progresoRepo.findByUsuarios).toHaveBeenCalledWith([10, 20]);
  });

  it('un padre solo ve su familia y nunca pide la lista completa', async () => {
    authApi.obtenerFamiliaPorPadre.mockResolvedValue(todas[0]);
    const r = await service.obtenerResumen({ sub: '5', idrol: 3 }, periodo);
    expect(authApi.listarFamilias).not.toHaveBeenCalled();
    expect(authApi.obtenerFamiliaPorPadre).toHaveBeenCalledWith(5);
    expect(r.familias.map((f) => f.id)).toEqual([1]);
    expect(progresoRepo.findByUsuarios).toHaveBeenCalledWith([10]);
  });

  it('un usuario sin familia recibe una lista vacía', async () => {
    authApi.obtenerFamiliaPorPadre.mockResolvedValue(null);
    const r = await service.obtenerResumen({ sub: 9, idrol: 3 }, periodo);
    expect(r.familias).toEqual([]);
  });
});
