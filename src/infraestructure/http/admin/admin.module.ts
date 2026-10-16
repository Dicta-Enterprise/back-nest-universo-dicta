import { Module } from '@nestjs/common';
import { AdminUsuariosController } from './admin-usuarios.controller';
import { AuthApiModule } from 'src/core/services/auth-api/auth-api.module';
import { TransactionApiModule } from 'src/core/services/transaction-api/transaction-api.module';
import { UsuariosAdminService } from 'src/core/services/usuarios-admin/usuarios-admin.service';

@Module({
  imports: [AuthApiModule, TransactionApiModule],
  controllers: [AdminUsuariosController],
  providers: [UsuariosAdminService],
})
export class AdminModule {}
