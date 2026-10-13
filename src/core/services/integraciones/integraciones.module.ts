import { Module } from '@nestjs/common';
import { AuthApiService } from './auth-api.service';
import { TitularService } from './titular.service';
import { TransactionApiService } from './transaction-api.service';

@Module({
  providers: [AuthApiService, TransactionApiService, TitularService],
  exports: [AuthApiService, TransactionApiService, TitularService],
})
export class IntegracionesModule {}
