import { Module } from '@nestjs/common';
import { BlockchainModule } from 'src/core/services/blockchain/blockchain.module';
import { AuthModule } from 'src/shared/auth/auth.module';
import { BlockchainPruebaController } from './blockchain-prueba.controller';

@Module({
  imports: [AuthModule, BlockchainModule],
  controllers: [BlockchainPruebaController],
})
export class BlockchainPruebaModule {}
