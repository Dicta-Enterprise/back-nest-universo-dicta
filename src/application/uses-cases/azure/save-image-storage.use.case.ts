import { Injectable } from '@nestjs/common';
import { AzureStorageService } from 'src/core/services/azure/azure-storage.service';
import { Result } from 'src/shared/domain/result/result';
import { AllowedFolder } from 'src/shared/types/folder.type';

@Injectable()
export class SaveImageStorageUseCase {
  constructor(private readonly azureStorageService: AzureStorageService) {}

  async execute(file: Express.Multer.File, folder: AllowedFolder): Promise<Result<string>> {
    try {
      const blob = await this.azureStorageService.uploadFile(file, folder);
      return Result.ok(blob);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
