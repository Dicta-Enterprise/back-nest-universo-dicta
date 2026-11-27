import { BadRequestException } from '@nestjs/common';

/** Peso máximo permitido por imagen (regla de negocio: WebP de máximo 80 KB). */
export const MAX_IMAGE_BYTES = 80 * 1024;

/**
 * Tope duro para multer: protege la memoria del servidor si alguien manda un archivo enorme.
 * El mensaje claro de "máximo 80 KB" lo da `validarImagenWebp`.
 */
export const MULTER_HARD_LIMIT_BYTES = 1024 * 1024;

const kb = (bytes: number): string => `${(bytes / 1024).toFixed(1)} KB`;

/**
 * Valida que el archivo sea una imagen WebP real (revisa la cabecera, no solo la extensión)
 * y que pese máximo 80 KB. Lanza 400 con un mensaje claro si no cumple.
 */
export function validarImagenWebp(file: Express.Multer.File | undefined, nombreCampo: string): void {
  if (!file || !file.buffer || file.size === 0) {
    throw new BadRequestException(`Falta el archivo de la imagen ${nombreCampo}.`);
  }

  const cabecera = file.buffer;
  const esWebp =
    cabecera.length > 12 &&
    cabecera.toString('ascii', 0, 4) === 'RIFF' &&
    cabecera.toString('ascii', 8, 12) === 'WEBP';

  if (!esWebp) {
    throw new BadRequestException(
      `La imagen ${nombreCampo} debe ser un archivo WebP (.webp). Recibimos "${file.originalname}".`,
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new BadRequestException(
      `La imagen ${nombreCampo} pesa ${kb(file.size)} y el máximo permitido es ${kb(MAX_IMAGE_BYTES)}. Comprímela o reduce sus dimensiones.`,
    );
  }
}
