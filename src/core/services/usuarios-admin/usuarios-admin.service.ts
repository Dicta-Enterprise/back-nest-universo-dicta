import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuthApiService, FiltrosUsuariosAuth, UsuarioAdminAuth } from 'src/core/services/auth-api/auth-api.service';
import {
  DetalleCompraUsuario,
  ResumenCompraUsuario,
  TransactionApiService,
} from 'src/core/services/transaction-api/transaction-api.service';

export type FiltroCompro = 'si' | 'no';

export interface FiltrosListaUsuarios extends FiltrosUsuariosAuth {
  compro?: FiltroCompro;
  compraDesde?: string;
  compraHasta?: string;
}

export interface CompraUsuario {
  compro: boolean;
  ordenesPagadas: number;
  fechaPrimeraCompra: string | null;
}

// PREMIUM = la cuenta ya compró; FREE = todavía no ha comprado nada.
export type TipoUsuario = 'PREMIUM' | 'FREE';

// compra es null para quien no compra por sí mismo (niños y jóvenes) o cuando el servicio de transacciones no respondió.
// tipoUsuario: un padre es PREMIUM si ya compró; un niño o joven toma el tipo de su familia (el de su padre). Es null cuando
// no se puede saber (el servicio de transacciones no respondió o el usuario no tiene familia): nunca se inventa FREE.
export type UsuarioAdminConCompra = UsuarioAdminAuth & { compra: CompraUsuario | null; tipoUsuario: TipoUsuario | null };

/** id de la familia -> id de su padre */
export type PadrePorFamilia = Map<number, number>;

export interface ListaUsuariosConCompra {
  items: UsuarioAdminConCompra[];
  total: number;
  page: number;
  limit: number;
  comprasDisponibles: boolean;
}

const POR_PAGINA_AUTH = 100;
const MAX_PAGINAS_AUTH = 50;
const LIMITE_POR_DEFECTO = 20;
const LIMITE_MAXIMO = 100;

/**
 * Une cada padre con su resumen de compras. Niños y jóvenes no compran, así que su compra queda sin dato;
 * su tipo (PREMIUM o FREE) es el de su familia, es decir, el de su padre.
 */
export function aplicarCompras(
  usuarios: UsuarioAdminAuth[],
  resumenes: ResumenCompraUsuario[],
  padrePorFamilia: PadrePorFamilia = new Map(),
): UsuarioAdminConCompra[] {
  const porId = new Map(resumenes.map((r) => [r.idusuario, r]));
  return usuarios.map((u) => {
    const resumen = u.rol === 'PADRE' ? porId.get(u.id) : undefined;
    const idPadre = u.rol === 'PADRE' ? u.id : u.familia ? padrePorFamilia.get(u.familia.id) : undefined;
    const resumenPadre = idPadre !== undefined ? porId.get(idPadre) : undefined;
    return {
      ...u,
      compra: resumen
        ? { compro: resumen.compro, ordenesPagadas: resumen.ordenesPagadas, fechaPrimeraCompra: resumen.fechaPrimeraCompra }
        : null,
      tipoUsuario: resumenPadre ? (resumenPadre.compro ? 'PREMIUM' : 'FREE') : null,
    };
  });
}

/** Filtra por si ya compró y por el rango de fecha de su primera compra. Quien no tiene dato de compra queda fuera. */
export function filtrarPorCompra(
  usuarios: UsuarioAdminConCompra[],
  filtros: Pick<FiltrosListaUsuarios, 'compro' | 'compraDesde' | 'compraHasta'>,
): UsuarioAdminConCompra[] {
  const desde = filtros.compraDesde ? new Date(filtros.compraDesde).getTime() : null;
  const hasta = filtros.compraHasta ? new Date(filtros.compraHasta).getTime() : null;

  return usuarios.filter((u) => {
    if (!u.compra) return false;
    if (filtros.compro === 'si' && !u.compra.compro) return false;
    if (filtros.compro === 'no' && u.compra.compro) return false;
    if (desde !== null || hasta !== null) {
      if (!u.compra.fechaPrimeraCompra) return false;
      const fecha = new Date(u.compra.fechaPrimeraCompra).getTime();
      if (desde !== null && fecha < desde) return false;
      if (hasta !== null && fecha > hasta) return false;
    }
    return true;
  });
}

export interface ComprasDeUsuario {
  usuario: { uuid: string; codigo: string; nombre: string; rol: UsuarioAdminAuth['rol'] };
  compras: DetalleCompraUsuario[];
  total: number;
}

/** Encuentra al usuario por UUID, código (USR-P-014) o id numérico; el filtro de back-auth también puede devolver familias. */
export function buscarUsuario(usuarios: UsuarioAdminAuth[], identificador: string): UsuarioAdminAuth | undefined {
  const buscado = identificador.trim().toLowerCase();
  return usuarios.find(
    (u) => u.uuid.toLowerCase() === buscado || u.codigo.toLowerCase() === buscado || String(u.id) === buscado,
  );
}

export function paginar<T>(items: T[], page = 1, limit = LIMITE_POR_DEFECTO) {
  const limite = Math.min(Math.max(limit, 1), LIMITE_MAXIMO);
  const pagina = Math.max(page, 1);
  const inicio = (pagina - 1) * limite;
  return { items: items.slice(inicio, inicio + limite), total: items.length, page: pagina, limit: limite };
}

@Injectable()
export class UsuariosAdminService {
  private readonly logger = new Logger(UsuariosAdminService.name);

  constructor(
    private readonly authApi: AuthApiService,
    private readonly transactionApi: TransactionApiService,
  ) {}

  async listar(filtros: FiltrosListaUsuarios): Promise<ListaUsuariosConCompra> {
    const { compro, compraDesde, compraHasta, ...filtrosAuth } = filtros;
    const filtraPorCompra = Boolean(compro || compraDesde || compraHasta);

    if (!filtraPorCompra) {
      const pagina = await this.authApi.listarUsuarios(filtrosAuth);
      try {
        const padrePorFamilia = await this.padresPorFamilia(pagina.items);
        const resumenes = await this.resumenesDePadres(pagina.items, padrePorFamilia);
        return { ...pagina, items: aplicarCompras(pagina.items, resumenes, padrePorFamilia), comprasDisponibles: true };
      } catch (error) {
        // La lista sigue siendo útil sin la columna de compras: se avisa en lugar de fallar.
        this.logger.warn(`No se pudieron traer las compras: ${(error as Error).message}`);
        return { ...pagina, items: aplicarCompras(pagina.items, []), comprasDisponibles: false };
      }
    }

    // Filtrar por compra exige conocer la compra de todos los candidatos; si el servicio falla, no se puede dar un resultado correcto.
    const candidatos = await this.traerTodos(filtrosAuth);
    const padrePorFamilia = await this.padresPorFamilia(candidatos);
    const resumenes = await this.resumenesDePadres(candidatos, padrePorFamilia);
    const filtrados = filtrarPorCompra(aplicarCompras(candidatos, resumenes, padrePorFamilia), { compro, compraDesde, compraHasta });
    return { ...paginar(filtrados, filtros.page, filtros.limit), comprasDisponibles: true };
  }

  /**
   * Compras de un usuario (fecha, país, ciudad y si salió bien o no) para la ventana de detalles del panel.
   * Solo los padres compran: para un niño o joven la lista va vacía, sin consultar a back-transaction.
   */
  async comprasDeUsuario(identificador: string): Promise<ComprasDeUsuario> {
    const { items } = await this.authApi.listarUsuarios({ id: identificador, page: 1, limit: LIMITE_MAXIMO });
    const encontrado = buscarUsuario(items, identificador);

    if (!encontrado) {
      throw new NotFoundException('No se encontró el usuario.');
    }

    const compras = encontrado.rol === 'PADRE' ? await this.transactionApi.detalleCompras(encontrado.id) : [];
    return {
      usuario: { uuid: encontrado.uuid, codigo: encontrado.codigo, nombre: encontrado.nombre, rol: encontrado.rol },
      compras,
      total: compras.length,
    };
  }

  // Compras de los padres de la lista y también de los padres de las familias de los niños y jóvenes de la lista.
  private async resumenesDePadres(usuarios: UsuarioAdminAuth[], padrePorFamilia: PadrePorFamilia = new Map()): Promise<ResumenCompraUsuario[]> {
    const ids = new Set(usuarios.filter((u) => u.rol === 'PADRE').map((u) => u.id));
    for (const u of usuarios) {
      const idPadre = u.rol !== 'PADRE' && u.familia ? padrePorFamilia.get(u.familia.id) : undefined;
      if (idPadre !== undefined) ids.add(idPadre);
    }
    return ids.size ? this.transactionApi.resumenCompras([...ids]) : [];
  }

  // Solo se consultan las familias si hay niños o jóvenes con familia en la lista. Si back-auth falla, su tipo queda sin dato.
  private async padresPorFamilia(usuarios: UsuarioAdminAuth[]): Promise<PadrePorFamilia> {
    const hayHijos = usuarios.some((u) => u.rol !== 'PADRE' && u.familia);
    if (!hayHijos) return new Map();

    try {
      const familias = await this.authApi.listarFamilias();
      return new Map(familias.map((f) => [f.id, f.padre.id]));
    } catch (error) {
      this.logger.warn(`No se pudieron traer las familias para calcular el tipo de usuario: ${(error as Error).message}`);
      return new Map();
    }
  }

  // Trae todas las páginas de back-auth (hasta MAX_PAGINAS_AUTH * POR_PAGINA_AUTH usuarios).
  private async traerTodos(filtrosAuth: FiltrosUsuariosAuth): Promise<UsuarioAdminAuth[]> {
    const sinPaginar: FiltrosUsuariosAuth = { ...filtrosAuth };
    delete sinPaginar.page;
    delete sinPaginar.limit;
    const todos: UsuarioAdminAuth[] = [];

    for (let page = 1; page <= MAX_PAGINAS_AUTH; page++) {
      const respuesta = await this.authApi.listarUsuarios({ ...sinPaginar, page, limit: POR_PAGINA_AUTH });
      todos.push(...respuesta.items);
      if (todos.length >= respuesta.total || respuesta.items.length === 0) break;
    }

    return todos;
  }
}
