import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { envs } from 'src/config/envs';

export interface ResumenCompraUsuario {
  idusuario: number;
  compro: boolean;
  ordenesPagadas: number;
  fechaPrimeraCompra: string | null;
}

export type ResultadoCompra = 'EXITOSA' | 'NO_EXITOSA' | 'EN_PROCESO' | 'DEVUELTA';

export interface DetalleCompraUsuario {
  idorden: number;
  // Momento de la compra en UTC (ISO 8601)
  fecha: string;
  // Hora de la compra en la zona horaria del comprador ("2026-07-22 14:05"); null si no se pudo ubicar
  fechaLocal: string | null;
  zonaHoraria: string | null;
  pais: string | null;
  ciudad: string | null;
  estado: string;
  resultado: ResultadoCompra;
  monto: number | null;
  moneda: string | null;
  cursos: string[];
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

  /** Todas las compras de un usuario (también las que no se pudieron cobrar), de la más reciente a la más antigua. */
  async detalleCompras(idusuario: number): Promise<DetalleCompraUsuario[]> {
    let response: Response;
    try {
      response = await fetch(`${envs.transactionApiUrl}/api/internal/compras/usuario/${idusuario}`, {
        headers: { 'x-internal-api-key': envs.internalApiKey },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      this.logger.error('No se pudo conectar con back-transaction.', error as Error);
      throw new ServiceUnavailableException('No se pudo conectar con el servicio de transacciones.');
    }

    if (!response.ok) {
      this.logger.error(`back-transaction respondió ${response.status} al consultar el detalle de compras.`);
      throw new BadGatewayException('El servicio de transacciones respondió con un error.');
    }

    return (await response.json()) as DetalleCompraUsuario[];
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
}
