import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureStorageService } from 'src/core/services/azure/azure-storage.service';
import { FolderEnum } from 'src/shared/enums/forlder.enum';

@Controller('az-upload')
export class UploadController {
  constructor(private readonly azureStorageService: AzureStorageService) {}

  @Post('upload/:tipo')
  @UseInterceptors(FileInterceptor('file'))
  uploadGenerico(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: FolderEnum,
  ) {
    return this.azureStorageService.uploadFile(file, folder);
  }

  @Get('test-health') //Validar si el contenedor existe
  async testAzure() {
    const blobName = 'cr7.jpg';
    const blobClient = await this.azureStorageService.getBlob(blobName);

    if (blobClient) {
      return { message: 'Blob exists', url: blobClient.url };
    } else {
      return { message: 'Blob does not exist' };
    }
  }
}
