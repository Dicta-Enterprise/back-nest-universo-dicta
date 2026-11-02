import { Module } from '@nestjs/common';
import { ValidatorService } from './application/validation/validator.service';
import { BunnyStorageService } from './services/bunny-storage.service';
import { BunnyStreamService } from './services/bunny-stream.service';

@Module({
  providers: [ValidatorService, BunnyStorageService, BunnyStreamService],
  exports: [ValidatorService, BunnyStorageService, BunnyStreamService],
})
export class SharedModule {}
