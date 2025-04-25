import {
  BlobClient,
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { FolderEnum } from 'src/shared/enums/forlder.enum';

@Injectable()
export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string = envs.azureBlobContainerName; // Replace with your container name

  constructor() {
    const account = envs.azureStorageAccountName;
    const accountKey = envs.azureStorageAccountKey;
    const sharedKeyCredential = new StorageSharedKeyCredential(
      account,
      accountKey,
    );
    this.blobServiceClient = new BlobServiceClient(
      envs.azureBlobStorageEndpoint,
      sharedKeyCredential,
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: FolderEnum,
  ): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    // await containerClient.createIfNotExists();
    const safeFileName = file.originalname.replace(/\s+/g, '');
    const uniqueFileName = `${Date.now()}-${safeFileName}`;
    const blobName = `${folder}/${uniqueFileName}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return blockBlobClient.url;
  }

  async getBlob(blobName: string): Promise<BlobClient> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlobClient(blobName);

    const exists = await blobClient.exists();

    if (!exists) {
      // this.logger.warn(`Blob no existe: ${blobName}`);
      console.log('Blob no existe: ', blobName);
    } else {
      // this.logger.log(`Blob ya existe: ${blobClient.url}`);
      console.log('Blob ya existe: ', blobClient.url);
    }

    return blobClient;
  }
}
