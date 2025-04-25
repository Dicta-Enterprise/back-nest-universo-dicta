import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { AzureStorageService } from 'src/core/services/azure/azure-storage.service';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [UploadController],
  providers: [AzureStorageService],
  exports: [],
})
export class AzureModule {}
