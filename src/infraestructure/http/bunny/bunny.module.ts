import { Module } from '@nestjs/common';
import { BunnyController } from './bunny.controller';
import { BunnyTokenService } from 'src/core/services/bunny/bunny-token.service';

@Module({
  controllers: [BunnyController],
  providers: [BunnyTokenService],
})
export class BunnyModule {}
