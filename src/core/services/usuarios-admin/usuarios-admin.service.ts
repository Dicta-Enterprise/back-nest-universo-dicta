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

// compra es null para quien no compra por sí mismo (niños y jóvenes) o cuando el servicio de transacciones no respondió.
export type UsuarioAdminConCompra = UsuarioAdminAuth & { compra: CompraUsuario | null };

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

/** Une cada padre con su resumen de compras. Niños y jóvenes no compran, así que quedan sin dato. */
export function aplicarCompras(usuarios: UsuarioAdminAuth[], resumenes: ResumenCompraUsuario[]): UsuarioAdminConCompra[] {
  const porId = new Map(resumenes.map((r) => [r.idusuario, r]));
  return usuarios.map((u) => {
    const resumen = u.rol === 'PADRE' ? porId.get(u.id) : undefined;
    return {
      ...u,
      compra: resumen
        ? { compro: resumen.compro, ordenesPagadas: resumen.ordenesPagadas, fechaPrimeraCompra: resumen.fechaPrimeraCompra }
        : null,
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
        const resumenes = await this.resumenesDePadres(pagina.items);
        return { ...pagina, items: aplicarCompras(pagina.items, resumenes), comprasDisponibles: true };
      } catch (error) {
        // La lista sigue siendo útil sin la columna de compras: se avisa en lugar de fallar.
        this.logger.warn(`No se pudieron traer las compras: ${(error as Error).message}`);
        return { ...pagina, items: aplicarCompras(pagina.items, []), comprasDisponibles: false };
      }
    }

    // Filtrar por compra exige conocer la compra de todos los candidatos; si el servicio falla, no se puede dar un resultado correcto.
    const candidatos = await this.traerTodos(filtrosAuth);
    const resumenes = await this.resumenesDePadres(candidatos);
    const filtrados = filtrarPorCompra(aplicarCompras(candidatos, resumenes), { compro, compraDesde, compraHasta });
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

  private async resumenesDePadres(usuarios: UsuarioAdminAuth[]): Promise<ResumenCompraUsuario[]> {
    const ids = usuarios.filter((u) => u.rol === 'PADRE').map((u) => u.id);
    return ids.length ? this.transactionApi.resumenCompras(ids) : [];
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
