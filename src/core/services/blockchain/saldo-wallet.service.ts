import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { formatEther, formatUnits, parseEther } from 'ethers';
import { envs } from 'src/config/envs';
import { BlockchainService } from './blockchain.service';

// Lo que gasta registrar o reemitir un certificado (medido: ~211 mil), con un poco de margen
const GAS_POR_CERTIFICADO = 220_000n;

export interface SaldoHotWallet {
  red: string;
  chainId: number;
  direccion: string;
  urlDireccion: string | null;
  saldoPol: string;
  precioGasGwei: string;
  costoPorCertificadoPol: string;
  // Cuántos certificados se pueden registrar con el saldo y el precio del gas de ahora
  certificadosQueAlcanzan: number | null;
  saldoMinimoPol: string;
  saldoBajo: boolean;
  fechaConsulta: Date;
}

// Avisa en el log cuando a la hot wallet le queda poco POL para pagar el gas
@Injectable()
export class SaldoWalletService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SaldoWalletService.name);

  constructor(private readonly blockchainService: BlockchainService) {}

  async consultar(): Promise<SaldoHotWallet> {
    const { direccion, saldoWei, precioGasWei } =
      await this.blockchainService.consultarSaldo();
    const costoPorCertificadoWei = GAS_POR_CERTIFICADO * precioGasWei;
    const minimoWei = parseEther(String(envs.saldoMinimoPol));

    return {
      ...this.blockchainService.datosRed(),
      direccion,
      urlDireccion: this.blockchainService.urlDireccion(direccion),
      saldoPol: formatEther(saldoWei),
      precioGasGwei: formatUnits(precioGasWei, 'gwei'),
      costoPorCertificadoPol: formatEther(costoPorCertificadoWei),
      certificadosQueAlcanzan:
        costoPorCertificadoWei > 0n
          ? Number(saldoWei / costoPorCertificadoWei)
          : null,
      saldoMinimoPol: String(envs.saldoMinimoPol),
      saldoBajo: saldoWei < minimoWei,
      fechaConsulta: new Date(),
    };
  }

  // Al arrancar, para enterarse enseguida si la wallet está casi vacía
  onApplicationBootstrap(): void {
    void this.revisar();
  }

  @Cron(CronExpression.EVERY_HOUR, { name: 'monitor-saldo-hot-wallet' })
  async revisar(): Promise<void> {
    let saldo: SaldoHotWallet;
    try {
      saldo = await this.consultar();
    } catch (error) {
      this.logger.warn(
        `No se pudo revisar el saldo de la hot wallet: ${error instanceof Error ? error.message : String(error)}`,
      );
      return;
    }

    const resumen = `${saldo.saldoPol} POL en ${saldo.direccion} (${saldo.red}), alcanza para ~${saldo.certificadosQueAlcanzan ?? '?'} certificados`;

    if (saldo.certificadosQueAlcanzan === 0) {
      this.logger.error(
        `La hot wallet no tiene POL para registrar certificados: ${resumen}. Hay que cargarle POL.`,
      );
    } else if (saldo.saldoBajo) {
      this.logger.warn(
        `Saldo bajo en la hot wallet: ${resumen}. Mínimo configurado: ${saldo.saldoMinimoPol} POL.`,
      );
    } else {
      this.logger.log(`Saldo de la hot wallet: ${resumen}`);
    }
  }
}
