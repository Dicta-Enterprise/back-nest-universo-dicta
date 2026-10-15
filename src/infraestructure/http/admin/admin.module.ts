import { Module } from '@nestjs/common';
import { AdminUsuariosController } from './admin-usuarios.controller';
import { AuthApiModule } from 'src/core/services/auth-api/auth-api.module';

@Module({
  imports: [AuthApiModule],
  controllers: [AdminUsuariosController],
})
export class AdminModule {}
