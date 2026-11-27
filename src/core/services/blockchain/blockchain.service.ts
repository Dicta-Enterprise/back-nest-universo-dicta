import { InjectQueue } from '@nestjs/bullmq';
import {
  HttpStatus,
  Injectable,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { Job, Queue, QueueEvents } from 'bullmq';
import {
  Contract,
  ContractTransactionResponse,
  getAddress,
  isAddress,
  JsonRpcProvider,
  TransactionReceipt,
  Wallet,
} from 'ethers';
import { envs } from 'src/config/envs';
import { configuracionColas } from 'src/config/redis';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { ClavesWalletService } from './claves-wallet.service';
import {
  COLA_BLOCKCHAIN,
  DatosReemisionBlockchain,
  DatosRegistroBlockchain,
  DatosRevocacionBlockchain,
  OperacionBlockchain,
} from './cola-blockchain.constants';

// Solo las funciones y eventos del contrato MundoDictarianoSBT que usa el backend
const ABI_CERTIFICADOS = [
  'function mintCertificate(address to, string certId, string metadataURI) returns (uint256)',
  'function revoke(uint256 tokenId, string reason)',
  'function reissue(uint256 oldTokenId, address to, string certId, string newMetadataURI, string reason) returns (uint256)',
  'function isRevoked(uint256 tokenId) view returns (bool)',
  'function certificateId(uint256 tokenId) view returns (string)',
  'event CertificateMinted(uint256 indexed tokenId, address indexed to, string certificateId, string tokenURI)',
];

const EXPLORADORES: Record<number, string> = {
  80002: 'https://amoy.polygonscan.com',
  137: 'https://polygonscan.com',
};

const NOMBRES_RED: Record<number, string> = {
  80002: 'Polygon Amoy (pruebas)',
  137: 'Polygon',
};

const TIEMPO_MAXIMO_CONFIRMACION_MS = 120_000;
// Incluye el tiempo que el trabajo espera su turno en la cola
const TIEMPO_MAXIMO_ESPERA_COLA_MS = 300_000;

export interface TransaccionBlockchain {
  txHash: string;
  urlTransaccion: string | null;
}

export interface RegistroBlockchain extends TransaccionBlockchain {
  tokenId: string;
}

export interface EstadoBlockchain {
  existe: boolean;
  revocado: boolean;
  codigoCertificado: string | null;
}

export type AlEnviarTransaccion = (txHash: string) => Promise<unknown>;

// Lo que BlockchainProcessor guarda en el trabajo mientras corre
export interface ProgresoTrabajo {
  txHash?: string;
}

interface Conexion {
  wallet: Wallet;
  contrato: Contract;
}

@Injectable()
export class BlockchainService implements OnModuleDestroy {
  private readonly logger = new Logger(BlockchainService.name);
  private conexion: Promise<Conexion> | null = null;
  private eventosCola: Promise<QueueEvents> | null = null;

  constructor(
    private readonly clavesWalletService: ClavesWalletService,
    @InjectQueue(COLA_BLOCKCHAIN) private readonly cola: Queue,
  ) {}

  registrarCertificado(
    codigoCertificado: string,
    uriMetadatos: string,
    walletDestino: string,
  ): Promise<RegistroBlockchain> {
    const datos: DatosRegistroBlockchain = {
      codigoCertificado,
      uriMetadatos,
      walletDestino: this.validarWallet(walletDestino),
    };
    return this.encolar(
      OperacionBlockchain.REGISTRAR,
      codigoCertificado,
      datos,
    );
  }

  revocarCertificado(
    codigoCertificado: string,
    tokenId: string,
    motivo: string,
  ): Promise<TransaccionBlockchain> {
    const datos: DatosRevocacionBlockchain = { tokenId, motivo };
    return this.encolar(OperacionBlockchain.REVOCAR, codigoCertificado, datos);
  }

  reemitirCertificado(
    tokenIdAnterior: string,
    codigoCertificadoNuevo: string,
    uriMetadatos: string,
    walletDestino: string,
    motivo: string,
  ): Promise<RegistroBlockchain> {
    const datos: DatosReemisionBlockchain = {
      tokenIdAnterior,
      codigoCertificadoNuevo,
      uriMetadatos,
      walletDestino: this.validarWallet(walletDestino),
      motivo,
    };
    return this.encolar(
      OperacionBlockchain.REEMITIR,
      codigoCertificadoNuevo,
      datos,
    );
  }

  async consultarCertificado(tokenId: string): Promise<EstadoBlockchain> {
    try {
      const { contrato } = await this.conectar();
      const [revocado, codigoCertificado]: [boolean, string] =
        await Promise.all([
          contrato.isRevoked(tokenId),
          contrato.certificateId(tokenId),
        ]);

      return {
        existe: codigoCertificado !== '',
        revocado,
        codigoCertificado: codigoCertificado || null,
      };
    } catch (error) {
      throw this.errorBlockchain('consultar', error);
    }
  }

  // Saldo de la hot wallet (la que paga el gas) y precio actual del gas, en wei
  async consultarSaldo(): Promise<{
    direccion: string;
    saldoWei: bigint;
    precioGasWei: bigint;
  }> {
    try {
      const { wallet } = await this.conectar();
      const provider = wallet.provider as JsonRpcProvider;
      const [saldoWei, tarifas] = await Promise.all([
        provider.getBalance(wallet.address),
        provider.getFeeData(),
      ]);

      return {
        direccion: wallet.address,
        saldoWei,
        precioGasWei: tarifas.gasPrice ?? tarifas.maxFeePerGas ?? 0n,
      };
    } catch (error) {
      throw this.errorBlockchain('consultar el saldo', error);
    }
  }

  urlDireccion(direccion: string): string | null {
    const explorador = EXPLORADORES[envs.blockchainChainId];
    return explorador ? `${explorador}/address/${direccion}` : null;
  }

  urlTransaccion(txHash: string): string | null {
    const explorador = EXPLORADORES[envs.blockchainChainId];
    return explorador ? `${explorador}/tx/${txHash}` : null;
  }

  // Página del token (el certificado) en Polygonscan
  urlToken(tokenId: string): string | null {
    const explorador = EXPLORADORES[envs.blockchainChainId];
    return explorador
      ? `${explorador}/nft/${envs.contractAddress}/${tokenId}`
      : null;
  }

  datosRed(): { red: string; chainId: number; contrato: string } {
    return {
      red: NOMBRES_RED[envs.blockchainChainId] ?? `Red ${envs.blockchainChainId}`,
      chainId: envs.blockchainChainId,
      contrato: envs.contractAddress,
    };
  }

  // Los métodos "ejecutar" los llama solo BlockchainProcessor, de a un trabajo por vez.
  // alEnviar guarda el hash en el trabajo apenas sale la transacción, por si falla la espera
  async ejecutarRegistro(
    { codigoCertificado, uriMetadatos, walletDestino }: DatosRegistroBlockchain,
    alEnviar: AlEnviarTransaccion,
  ): Promise<RegistroBlockchain> {
    const { contrato } = await this.conectar();
    const tx: ContractTransactionResponse = await contrato.mintCertificate(
      walletDestino,
      codigoCertificado,
      uriMetadatos,
    );
    await alEnviar(tx.hash);
    const receipt = await tx.wait(1, TIEMPO_MAXIMO_CONFIRMACION_MS);
    return this.armarRegistro(contrato, receipt);
  }

  async ejecutarRevocacion(
    { tokenId, motivo }: DatosRevocacionBlockchain,
    alEnviar: AlEnviarTransaccion,
  ): Promise<TransaccionBlockchain> {
    const { contrato } = await this.conectar();
    const tx: ContractTransactionResponse = await contrato.revoke(
      tokenId,
      motivo,
    );
    await alEnviar(tx.hash);
    const receipt = await tx.wait(1, TIEMPO_MAXIMO_CONFIRMACION_MS);
    return this.armarTransaccion(receipt);
  }

  async ejecutarReemision(
    {
      tokenIdAnterior,
      codigoCertificadoNuevo,
      uriMetadatos,
      walletDestino,
      motivo,
    }: DatosReemisionBlockchain,
    alEnviar: AlEnviarTransaccion,
  ): Promise<RegistroBlockchain> {
    const { contrato } = await this.conectar();
    const tx: ContractTransactionResponse = await contrato.reissue(
      tokenIdAnterior,
      walletDestino,
      codigoCertificadoNuevo,
      uriMetadatos,
      motivo,
    );
    await alEnviar(tx.hash);
    const receipt = await tx.wait(1, TIEMPO_MAXIMO_CONFIRMACION_MS);
    return this.armarRegistro(contrato, receipt);
  }

  async onModuleDestroy() {
    if (this.eventosCola) {
      await (await this.eventosCola).close();
    }
  }

  // Agrega el trabajo a la cola de Redis y espera a que BlockchainProcessor lo termine.
  // El id fijo por certificado hace que reintentar no mande la transacción dos veces:
  // si el trabajo ya terminó, BullMQ no crea otro y se devuelve el resultado guardado
  private async encolar<T>(
    operacion: OperacionBlockchain,
    codigoCertificado: string,
    datos: object,
  ): Promise<T> {
    try {
      const eventosCola = await this.obtenerEventosCola();
      const idTrabajo = `${operacion}-${codigoCertificado}`;

      const previo = await this.cola.getJob(idTrabajo);
      if (previo && (await previo.isFailed())) {
        const recuperado = await this.recuperarDeTransaccion(operacion, previo);
        if (recuperado) return recuperado as T;
        await previo.remove();
      }

      const trabajo = await this.cola.add(operacion, datos, {
        jobId: idTrabajo,
      });
      return await trabajo.waitUntilFinished(
        eventosCola,
        TIEMPO_MAXIMO_ESPERA_COLA_MS,
      );
    } catch (error) {
      throw this.errorBlockchain(operacion, error);
    }
  }

  // Un trabajo puede fallar después de enviar la transacción (por ejemplo, si tardó en
  // confirmarse). Antes de mandarla de nuevo se revisa si la anterior llegó a la red
  private async recuperarDeTransaccion(
    operacion: OperacionBlockchain,
    trabajo: Job,
  ): Promise<RegistroBlockchain | TransaccionBlockchain | null> {
    const { txHash } = (trabajo.progress ?? {}) as ProgresoTrabajo;
    if (!txHash) return null;

    const { wallet, contrato } = await this.conectar();
    const provider = wallet.provider as JsonRpcProvider;
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      if (await provider.getTransaction(txHash)) {
        throw new BussinesRuleException(
          'La transacción anterior todavía no se confirma en la red. Intenta de nuevo en unos minutos.',
          HttpStatus.CONFLICT,
          { codigoError: 'TRANSACCION_EN_CURSO', txHash },
        );
      }
      // La red la descartó: se puede mandar de nuevo
      return null;
    }

    // status 0 = la transacción falló en el contrato: se puede mandar de nuevo
    if (receipt.status !== 1) return null;

    return operacion === OperacionBlockchain.REVOCAR
      ? this.armarTransaccion(receipt)
      : this.armarRegistro(contrato, receipt);
  }

  private validarWallet(direccion: string): string {
    if (!isAddress(direccion)) {
      throw new BussinesRuleException(
        'La wallet de destino no es una dirección válida',
        HttpStatus.BAD_REQUEST,
        { codigoError: 'WALLET_DESTINO_INVALIDA' },
      );
    }

    return getAddress(direccion);
  }

  private obtenerEventosCola(): Promise<QueueEvents> {
    if (!this.eventosCola) {
      this.eventosCola = this.crearEventosCola().catch((error) => {
        this.eventosCola = null;
        throw error;
      });
    }

    return this.eventosCola;
  }

  private async crearEventosCola(): Promise<QueueEvents> {
    // Una sola transacción a la vez en total, aunque haya varias copias del backend
    await this.cola.setGlobalConcurrency(1);

    const eventosCola = new QueueEvents(COLA_BLOCKCHAIN, {
      ...configuracionColas,
      // Espera larga para gastar menos comandos de Redis cuando no hay trabajos
      blockingTimeout: 60_000,
    });
    await eventosCola.waitUntilReady();

    return eventosCola;
  }

  private conectar(): Promise<Conexion> {
    if (!this.conexion) {
      this.conexion = this.crearConexion().catch((error) => {
        this.conexion = null;
        throw error;
      });
    }

    return this.conexion;
  }

  private async crearConexion(): Promise<Conexion> {
    const provider = new JsonRpcProvider(envs.blockchainRpcUrl);
    const { chainId } = await provider.getNetwork();

    if (chainId !== BigInt(envs.blockchainChainId)) {
      throw new BussinesRuleException(
        'La red del RPC no coincide con BLOCKCHAIN_CHAIN_ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          codigoError: 'BLOCKCHAIN_RED_INCORRECTA',
          esperado: envs.blockchainChainId,
          recibido: chainId.toString(),
        },
      );
    }

    const clavePrivada = await this.clavesWalletService.obtenerClavePrivada();
    const wallet = new Wallet(clavePrivada, provider);
    const contrato = new Contract(
      envs.contractAddress,
      ABI_CERTIFICADOS,
      wallet,
    );

    return { wallet, contrato };
  }

  private armarTransaccion(receipt: TransactionReceipt): TransaccionBlockchain {
    return {
      txHash: receipt.hash,
      urlTransaccion: this.urlTransaccion(receipt.hash),
    };
  }

  private armarRegistro(
    contrato: Contract,
    receipt: TransactionReceipt,
  ): RegistroBlockchain {
    for (const log of receipt.logs) {
      const evento = contrato.interface.parseLog(log);

      if (evento?.name === 'CertificateMinted') {
        return {
          tokenId: evento.args.tokenId.toString(),
          txHash: receipt.hash,
          urlTransaccion: this.urlTransaccion(receipt.hash),
        };
      }
    }

    throw new Error('La transacción no emitió el evento CertificateMinted');
  }

  private errorBlockchain(
    operacion: string,
    error: unknown,
  ): BussinesRuleException {
    if (error instanceof BussinesRuleException) {
      return error;
    }

    this.logger.error(
      `Error al ${operacion} en blockchain`,
      error instanceof Error ? error.stack : String(error),
    );

    return new BussinesRuleException(
      'No se pudo completar la operación en blockchain',
      HttpStatus.BAD_GATEWAY,
      { codigoError: 'BLOCKCHAIN_ERROR', operacion },
    );
  }
}
