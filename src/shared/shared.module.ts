import { Module } from '@nestjs/common';
import { ValidatorService } from './application/validation/validator.service';
import { BunnyStorageService } from './services/bunny-storage.service';

@Module({
  providers: [ValidatorService, BunnyStorageService],
  exports: [ValidatorService, BunnyStorageService],
})
export class SharedModule {}
