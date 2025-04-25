import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { AzureStorageService } from 'src/core/services/azure/azure-storage.service';
import { SaveImageStorageUseCase } from 'src/application/uses-cases/azure/save-image-storage.use.case';
import { SharedPipesModule } from 'src/shared/pipes/shared.pipes.module';

@Module({
  imports: [SharedModule, PrismaModule, SharedPipesModule],
  controllers: [UploadController],
  providers: [AzureStorageService, SaveImageStorageUseCase],

  exports: [],
})
export class AzureModule {}
