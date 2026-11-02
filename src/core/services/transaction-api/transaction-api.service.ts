import { BadGatewayException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { envs } from 'src/config/envs';

export interface ResumenCompraUsuario {
  idusuario: number;
  compro: boolean;
  ordenesPagadas: number;
  fechaPrimeraCompra: string | null;
}

// Facturación administrativa (documento de Stephan, 17-oct-2026).
export interface FiltrosOrdenesAdmin {
  idusuario?: number;
  desde?: string;
  hasta?: string;
  page?: number;
  limit?: number;
}

export interface OrdenAdmin {
  id: number;
  idusuario: number;
  fechacreacion: string;
  estado: string;
  pagante: { nombre: string | null; email: string | null } | null;
  monto: string | null;
  metodopago: string | null;
  cursos: { idcurso: string; nombrecurso: string | null; precio: string }[];
  factura: { numeroFactura: string; cufe: string | null; url: string | null } | null;
}

export interface ReclamoAdmin {
  id: number;
  idorden: number;
  descripcion: string;
  fechacreacion: string;
  atendioPor: string | null;
  estado: string;
}

export interface PaginaOrdenesAdmin {
  items: OrdenAdmin[];
  total: number;
  page: number;
  limit: number;
}

const TIMEOUT_MS = 5000;
// back-transaction acepta como máximo 1000 ids por consulta.
const TAMANO_LOTE = 1000;

// Cliente de los endpoints /internal de back-transaction (quién ya compró y cuándo).
@Injectable()
export class TransactionApiService {
  private readonly logger = new Logger(TransactionApiService.name);

  async resumenCompras(ids: number[]): Promise<ResumenCompraUsuario[]> {
    const unicos = [...new Set(ids)];
    const resultado: ResumenCompraUsuario[] = [];

    for (let i = 0; i < unicos.length; i += TAMANO_LOTE) {
      resultado.push(...(await this.consultarLote(unicos.slice(i, i + TAMANO_LOTE))));
    }

    return resultado;
  }

  private async consultarLote(ids: number[]): Promise<ResumenCompraUsuario[]> {
    let response: Response;
    try {
      response = await fetch(`${envs.transactionApiUrl}/api/internal/compras/resumen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-internal-api-key': envs.internalApiKey },
        body: JSON.stringify({ ids }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      this.logger.error('No se pudo conectar con back-transaction.', error as Error);
      throw new ServiceUnavailableException('No se pudo conectar con el servicio de transacciones.');
    }

    if (!response.ok) {
      this.logger.error(`back-transaction respondió ${response.status} al consultar compras.`);
      throw new BadGatewayException('El servicio de transacciones respondió con un error.');
    }

    return (await response.json()) as ResumenCompraUsuario[];
  }

  async listarOrdenes(filtros: FiltrosOrdenesAdmin): Promise<PaginaOrdenesAdmin> {
    const params = new URLSearchParams();
    if (filtros.idusuario) params.set('idusuario', String(filtros.idusuario));
    if (filtros.desde) params.set('desde', filtros.desde);
    if (filtros.hasta) params.set('hasta', filtros.hasta);
    if (filtros.page) params.set('page', String(filtros.page));
    if (filtros.limit) params.set('limit', String(filtros.limit));

    return this.pedir<PaginaOrdenesAdmin>('GET', `/api/internal/ordenes?${params.toString()}`);
  }

  async obtenerOrden(id: number): Promise<OrdenAdmin & { reclamos: ReclamoAdmin[] }> {
    return this.pedir('GET', `/api/internal/ordenes/${id}`);
  }

  async reenviarComprobante(id: number): Promise<{ enviado: boolean }> {
    return this.pedir('POST', `/api/internal/ordenes/${id}/reenviar-comprobante`);
  }

  async registrarReclamo(id: number, descripcion: string, atendioPor: string): Promise<ReclamoAdmin> {
    return this.pedir('POST', `/api/internal/ordenes/${id}/reclamo`, { descripcion, atendioPor });
  }

  private async pedir<T>(metodo: 'GET' | 'POST', ruta: string, body?: unknown): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${envs.transactionApiUrl}${ruta}`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json', 'x-internal-api-key': envs.internalApiKey },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      this.logger.error('No se pudo conectar con back-transaction.', error as Error);
      throw new ServiceUnavailableException('No se pudo conectar con el servicio de transacciones.');
    }

    if (!response.ok) {
      this.logger.error(`back-transaction respondió ${response.status} en ${ruta}.`);
      if (response.status === 404) throw new NotFoundException('No existe esa orden.');
      throw new BadGatewayException('El servicio de transacciones respondió con un error.');
    }

    return (await response.json()) as T;
  }
}
