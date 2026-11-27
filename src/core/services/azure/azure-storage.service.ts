import { Injectable } from '@nestjs/common';
import { AllowedFolder } from 'src/shared/types/folder.type';
import { BunnyStorageService, ZONA_TEXTURAS } from 'src/shared/services/bunny-storage.service';

/**
 * Sube las imágenes de galaxias, planetas y categorías a Bunny (zona
 * "texturas-de-mundos-mundodictariano"), en lugar de Azure Blob Storage.
 *
 * La clase conserva el nombre "AzureStorageService" y la misma forma (uploadFile/deleteBlob)
 * a propósito: la usan 4 módulos y 2 casos de uso que no hacía falta tocar. Si se quiere
 * renombrarla más adelante para que el nombre no confunda, es un cambio aparte, de bajo riesgo.
 */
@Injectable()
export class AzureStorageService {
  constructor(private readonly bunny: BunnyStorageService) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: AllowedFolder,
  ): Promise<string> {
    const safeFileName = file.originalname.replace(/\s+/g, '');
    const uniqueFileName = `${Date.now()}-${safeFileName}`;
    const ruta = `${folder}/${uniqueFileName}`;

    return this.bunny.subirArchivo(ZONA_TEXTURAS, ruta, file.buffer, file.mimetype || 'image/webp');
  }

  async deleteBlob(blobName: string): Promise<boolean> {
    // Nota: igual que en la versión de Azure, aquí llega solo el nombre del archivo (sin la
    // carpeta), porque quien llama extrae nada más el último segmento de la URL. Es una
    // limitación que ya existía antes de este cambio, no algo nuevo de Bunny.
    try {
      await this.bunny.borrarArchivo(ZONA_TEXTURAS, blobName);
      return true;
    } catch {
      return false;
    }
  }
}
