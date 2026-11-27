import { Module } from '@nestjs/common';
import * as useCase from 'src/application/uses-cases/blockchain';
import { BlockchainModule } from 'src/core/services/blockchain/blockchain.module';
import { AuthModule } from 'src/shared/auth/auth.module';
import { BlockchainController } from './blockchain.controller';

@Module({
  imports: [AuthModule, BlockchainModule],
  controllers: [BlockchainController],
  providers: [useCase.ConsultarSaldoBlockchainUseCase],
})
export class BlockchainHttpModule {}
