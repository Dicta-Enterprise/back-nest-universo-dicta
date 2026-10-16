import { Module } from '@nestjs/common';
import { TransactionApiService } from './transaction-api.service';

@Module({
  providers: [TransactionApiService],
  exports: [TransactionApiService],
})
export class TransactionApiModule {}
