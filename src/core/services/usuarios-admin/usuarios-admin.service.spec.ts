import { NotFoundException } from '@nestjs/common';
import { aplicarCompras, buscarUsuario, filtrarPorCompra, paginar, UsuariosAdminService } from './usuarios-admin.service';
import { UsuarioAdminAuth } from 'src/core/services/auth-api/auth-api.service';

jest.mock('src/config/envs', () => ({ envs: {} }));

const usuario = (id: number, rol: 'PADRE' | 'NINO' | 'JOVEN'): UsuarioAdminAuth => ({
  id,
  uuid: `00000000-0000-4000-8000-${String(id).padStart(12, '0')}`,
  codigo: `USR-${rol[0]}-${String(id).padStart(3, '0')}`,
  tipo: rol === 'PADRE' ? 'P' : rol === 'NINO' ? 'N' : 'J',
  rol,
  nombre: `u${id}`,
  email: `u${id}@x.co`,
  estado: 'ACTIVA',
  familia: null,
  fechaRegistro: '2026-10-01T00:00:00.000Z',
});

const resumenes = [
  { idusuario: 1, compro: true, ordenesPagadas: 2, fechaPrimeraCompra: '2026-07-22T10:00:00.000Z' },
  { idusuario: 2, compro: false, ordenesPagadas: 0, fechaPrimeraCompra: null },
  { idusuario: 3, compro: true, ordenesPagadas: 1, fechaPrimeraCompra: '2026-09-15T10:00:00.000Z' },
];
const lista = [usuario(1, 'PADRE'), usuario(2, 'PADRE'), usuario(3, 'PADRE'), usuario(4, 'NINO')];

describe('aplicarCompras', () => {
  it('une cada padre con su compra y deja sin dato a niños y jóvenes', () => {
    const r = aplicarCompras(lista, resumenes);
    expect(r[0].compra).toEqual({ compro: true, ordenesPagadas: 2, fechaPrimeraCompra: '2026-07-22T10:00:00.000Z' });
    expect(r[1].compra).toMatchObject({ compro: false, fechaPrimeraCompra: null });
    expect(r[3].compra).toBeNull();
  });
});

describe('filtrarPorCompra', () => {
  const conCompra = aplicarCompras(lista, resumenes);

  it('compro=si deja solo a los compradores y compro=no solo a los padres que no compraron', () => {
    expect(filtrarPorCompra(conCompra, { compro: 'si' }).map((u) => u.id)).toEqual([1, 3]);
    expect(filtrarPorCompra(conCompra, { compro: 'no' }).map((u) => u.id)).toEqual([2]);
  });

  it('filtra por rango de fecha de la primera compra', () => {
    expect(filtrarPorCompra(conCompra, { compraDesde: '2026-09-01' }).map((u) => u.id)).toEqual([3]);
    expect(filtrarPorCompra(conCompra, { compraHasta: '2026-08-01' }).map((u) => u.id)).toEqual([1]);
  });
});

describe('buscarUsuario', () => {
  it('encuentra al usuario por UUID, por código o por id, sin importar mayúsculas', () => {
    expect(buscarUsuario(lista, lista[1].uuid)?.id).toBe(2);
    expect(buscarUsuario(lista, lista[1].uuid.toUpperCase())?.id).toBe(2);
    expect(buscarUsuario(lista, 'usr-p-003')?.id).toBe(3);
    expect(buscarUsuario(lista, '4')?.id).toBe(4);
  });

  it('devuelve undefined si no hay coincidencia exacta', () => {
    expect(buscarUsuario(lista, 'USR-P-999')).toBeUndefined();
    expect(buscarUsuario(lista, '')).toBeUndefined();
  });
});

describe('paginar', () => {
  it('pagina y respeta el límite máximo', () => {
    expect(paginar([1, 2, 3, 4, 5], 2, 2)).toEqual({ items: [3, 4], total: 5, page: 2, limit: 2 });
    expect(paginar([1], 1, 5000).limit).toBe(100);
  });
});

describe('UsuariosAdminService', () => {
  const pagina = { items: lista, total: 4, page: 1, limit: 20 };

  const crear = (transaction: { resumenCompras: jest.Mock }, auth = { listarUsuarios: jest.fn().mockResolvedValue(pagina) }) =>
    ({
      service: new UsuariosAdminService(
        auth as unknown as ConstructorParameters<typeof UsuariosAdminService>[0],
        transaction as unknown as ConstructorParameters<typeof UsuariosAdminService>[1],
      ),
      auth,
    });

  it('sin filtro de compra pasa la página de back-auth y consulta solo los padres', async () => {
    const transaction = { resumenCompras: jest.fn().mockResolvedValue(resumenes) };
    const { service, auth } = crear(transaction);
    const r = await service.listar({ q: 'x', page: 1, limit: 20 });
    expect(auth.listarUsuarios).toHaveBeenCalledWith({ q: 'x', page: 1, limit: 20 });
    expect(transaction.resumenCompras).toHaveBeenCalledWith([1, 2, 3]);
    expect(r.comprasDisponibles).toBe(true);
    expect(r.items[0].compra?.compro).toBe(true);
  });

  it('si el servicio de transacciones falla, la lista sale igual sin compras y avisa', async () => {
    const transaction = { resumenCompras: jest.fn().mockRejectedValue(new Error('caído')) };
    const { service } = crear(transaction);
    const r = await service.listar({});
    expect(r.comprasDisponibles).toBe(false);
    expect(r.total).toBe(4);
    expect(r.items.every((u) => u.compra === null)).toBe(true);
  });

  it('con filtro de compra trae todos los candidatos, filtra y pagina, y no manda el filtro a back-auth', async () => {
    const transaction = { resumenCompras: jest.fn().mockResolvedValue(resumenes) };
    const { service, auth } = crear(transaction);
    const r = await service.listar({ compro: 'si', rol: 'PADRE', page: 1, limit: 1 });
    expect(auth.listarUsuarios).toHaveBeenCalledWith({ rol: 'PADRE', page: 1, limit: 100 });
    expect(r).toMatchObject({ total: 2, page: 1, limit: 1 });
    expect(r.items.map((u) => u.id)).toEqual([1]);
  });

  it('con filtro de compra, si transacciones falla, no devuelve un resultado a medias', async () => {
    const transaction = { resumenCompras: jest.fn().mockRejectedValue(new Error('caído')) };
    const { service } = crear(transaction);
    await expect(service.listar({ compro: 'no' })).rejects.toThrow('caído');
  });
});

describe('UsuariosAdminService.comprasDeUsuario', () => {
  const compraDemo = {
    idorden: 41,
    fecha: '2026-07-22T19:05:00.000Z',
    fechaLocal: '2026-07-22 14:05',
    zonaHoraria: 'America/Bogota',
    pais: 'Colombia',
    ciudad: 'Bogotá',
    estado: 'COMPLETADO',
    resultado: 'EXITOSA' as const,
    monto: 50000,
    moneda: 'COP',
    cursos: ['Cyberbullying - Niños'],
  };

  const crear = (detalle: jest.Mock = jest.fn().mockResolvedValue([compraDemo])) => {
    const auth = { listarUsuarios: jest.fn().mockResolvedValue({ items: lista, total: 4, page: 1, limit: 100 }) };
    const transaction = { detalleCompras: detalle, resumenCompras: jest.fn() };
    return { service: new UsuariosAdminService(auth as never, transaction as never), auth, transaction };
  };

  it('devuelve las compras del padre usando su id interno, buscado por UUID o código', async () => {
    const { service, auth, transaction } = crear();
    const r = await service.comprasDeUsuario('usr-p-002');

    expect(auth.listarUsuarios).toHaveBeenCalledWith({ id: 'usr-p-002', page: 1, limit: 100 });
    expect(transaction.detalleCompras).toHaveBeenCalledWith(2);
    expect(r).toEqual({
      usuario: { uuid: lista[1].uuid, codigo: 'USR-P-002', nombre: 'u2', rol: 'PADRE' },
      compras: [compraDemo],
      total: 1,
    });
  });

  it('un niño o joven no compra: lista vacía sin consultar a back-transaction', async () => {
    const { service, transaction } = crear();
    const r = await service.comprasDeUsuario(lista[3].uuid);

    expect(r.compras).toEqual([]);
    expect(r.total).toBe(0);
    expect(transaction.detalleCompras).not.toHaveBeenCalled();
  });

  it('si no existe el usuario responde 404 y no consulta compras', async () => {
    const { service, transaction } = crear();
    await expect(service.comprasDeUsuario('USR-P-999')).rejects.toBeInstanceOf(NotFoundException);
    expect(transaction.detalleCompras).not.toHaveBeenCalled();
  });

  it('si back-transaction falla, el error sale tal cual (no se inventa un listado vacío)', async () => {
    const { service } = crear(jest.fn().mockRejectedValue(new Error('caído')));
    await expect(service.comprasDeUsuario('USR-P-001')).rejects.toThrow('caído');
  });
});
