import { BadRequestException, Injectable } from '@nestjs/common';
import { BunnyStorageService, ZONA_CURSOS } from 'src/shared/services/bunny-storage.service';
import { CursoImagenes } from 'src/core/entities/curso/curso.entity';

/**
 * Sube la imagen de un curso a Bunny (zona "tarjetas-cursos-mundo-dictariano").
 *
 * Antes este servicio redimensionaba 2 archivos (principal/secundaria) en 6 versiones WebP
 * y las subía a Cloudinary. Se simplificó a UNA sola imagen por decisión de Carlos y Wilson
 * (reunión del 30-sep-2026): "dejamos solamente una, simplemente arrastra la misma" tanto
 * para el catálogo como para la LMS. El archivo ya llega validado como WebP de máximo 80 KB
 * por `validarImagenWebp()` en el controlador, así que aquí no hace falta volver a procesarlo.
 */
@Injectable()
export class ImageProcessingService {
  constructor(private readonly bunny: BunnyStorageService) {}

  async processFromFiles(principalFile: Express.Multer.File): Promise<CursoImagenes> {
    try {
      const nombreArchivo = `${Date.now()}-principal.webp`;
      const principal = await this.bunny.subirArchivo(
        ZONA_CURSOS,
        nombreArchivo,
        principalFile.buffer,
        'image/webp',
      );
      return { principal };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Fallo al subir la imagen: ${msg}`);
    }
  }
}
