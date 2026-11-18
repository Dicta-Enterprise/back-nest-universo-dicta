import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { AdminGuard } from './admin.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';

@Module({
  imports: [JwtModule.register({ secret: envs.jwtSecret })],
  providers: [JwtAuthGuard, AdminGuard, OptionalJwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard, AdminGuard, OptionalJwtAuthGuard],
})
export class AuthModule {}
