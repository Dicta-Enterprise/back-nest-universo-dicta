import { Module } from '@nestjs/common';
import { AuthModule } from 'src/shared/auth/auth.module';
import { BunnyController } from './bunny.controller';
import { BunnyTokenService } from 'src/core/services/bunny/bunny-token.service';

@Module({
  imports: [AuthModule],
  controllers: [BunnyController],
  providers: [BunnyTokenService],
})
export class BunnyModule {}
