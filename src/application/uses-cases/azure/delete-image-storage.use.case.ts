import { Injectable } from '@nestjs/common';
import { AzureStorageService } from 'src/core/services/azure/azure-storage.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class DeleteImageStorageUseCase {
  constructor(private readonly azureStorageService: AzureStorageService) {}

  async execute(blobName: string): Promise<Result<boolean>> {
    try {
      // Extraer el nombre del archivo de la URL completa
      const fileName = this.extractFileNameFromUrl(blobName);

      const deleted = await this.azureStorageService.deleteBlob(fileName);
      return Result.ok(deleted);
    } catch (error) {
      return Result.fail(error);
    }
  }

  private extractFileNameFromUrl(url: string): string {
    // Implementación según cómo estén estructuradas tus URLs en Azure
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
