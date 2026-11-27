import { Injectable } from '@nestjs/common';
import {
  SaldoHotWallet,
  SaldoWalletService,
} from 'src/core/services/blockchain/saldo-wallet.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ConsultarSaldoBlockchainUseCase {
  constructor(private readonly saldoWalletService: SaldoWalletService) {}

  async execute(): Promise<Result<SaldoHotWallet>> {
    try {
      return Result.ok(await this.saldoWalletService.consultar());
    } catch (error) {
      return Result.fail(error);
    }
  }
}
