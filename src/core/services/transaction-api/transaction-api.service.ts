import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { envs } from 'src/config/envs';

export interface ResumenCompraUsuario {
  idusuario: number;
  compro: boolean;
  ordenesPagadas: number;
  fechaPrimeraCompra: string | null;
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
}
