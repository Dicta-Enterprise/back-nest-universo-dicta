import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { configuracionColas } from 'src/config/redis';
import { BlockchainProcessor } from './blockchain.processor';
import { BlockchainService } from './blockchain.service';
import { ClavesWalletService } from './claves-wallet.service';
import { COLA_BLOCKCHAIN } from './cola-blockchain.constants';
import { PinataService } from './pinata.service';
import { PrivyService } from './privy.service';
import { SaldoWalletService } from './saldo-wallet.service';

@Module({
  imports: [
    BullModule.forRoot(configuracionColas),
    BullModule.registerQueue({
      name: COLA_BLOCKCHAIN,
      defaultJobOptions: {
        // Sin reintentos automáticos: reintentar una transacción que quizás
        // ya se envió podría registrar el mismo certificado dos veces
        attempts: 1,
        // Se guardan 30 días: el reintento usa el resultado para no registrar dos veces
        removeOnComplete: { age: 30 * 24 * 3600 },
        removeOnFail: { age: 30 * 24 * 3600 },
      },
    }),
  ],
  providers: [
    ClavesWalletService,
    BlockchainService,
    BlockchainProcessor,
    PinataService,
    PrivyService,
    SaldoWalletService,
  ],
  exports: [BlockchainService, PinataService, PrivyService, SaldoWalletService],
})
export class BlockchainModule {}
