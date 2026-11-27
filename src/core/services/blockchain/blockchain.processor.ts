import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { BlockchainService, ProgresoTrabajo } from './blockchain.service';
import { COLA_BLOCKCHAIN, OperacionBlockchain } from './cola-blockchain.constants';

@Processor(COLA_BLOCKCHAIN, {
  concurrency: 1,
  // Esperas largas para gastar menos comandos de Redis cuando no hay trabajos
  drainDelay: 30,
  stalledInterval: 60_000,
  // Un trabajo trabado (el servidor se cayó a la mitad) falla en vez de repetirse solo:
  // pudo haber enviado ya la transacción. Se recupera con el reintento del certificado
  maxStalledCount: 0,
})
export class BlockchainProcessor extends WorkerHost {
  private readonly logger = new Logger(BlockchainProcessor.name);

  constructor(private readonly blockchainService: BlockchainService) {
    super();
  }

  async process(trabajo: Job): Promise<unknown> {
    const alEnviar = (txHash: string) => {
      const progreso: ProgresoTrabajo = { txHash };
      return trabajo.updateProgress(progreso);
    };

    try {
      switch (trabajo.name) {
        case OperacionBlockchain.REGISTRAR:
          return await this.blockchainService.ejecutarRegistro(
            trabajo.data,
            alEnviar,
          );
        case OperacionBlockchain.REVOCAR:
          return await this.blockchainService.ejecutarRevocacion(
            trabajo.data,
            alEnviar,
          );
        case OperacionBlockchain.REEMITIR:
          return await this.blockchainService.ejecutarReemision(
            trabajo.data,
            alEnviar,
          );
        default:
          throw new Error(`Operación de blockchain desconocida: ${trabajo.name}`);
      }
    } catch (error) {
      this.logger.error(
        `Falló el trabajo "${trabajo.name}" (${trabajo.id})`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
