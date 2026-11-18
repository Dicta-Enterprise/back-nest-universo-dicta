import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface TokenReproduccion {
  url: string;
  expires: number;
}

/**
 * Genera el link de reproduccion FIRMADO de Bunny Stream ("Token Authentication"): sin esto,
 * cualquiera que consiga el libraryId+videoId (aunque no haya comprado el curso) puede
 * reproducir el video para siempre con solo pegar el link del embed en el navegador, porque
 * el CDN de Bunny no revisa nada por su cuenta. Con el token, el link deja de servir pasados
 * "duracionSegundos" y Bunny lo rechaza si no coincide con la security key real de la libreria.
 *
 * Pedido de Carlos (ver documento) + Andrea (12 nov 2026): cerrar esta brecha.
 */
@Injectable()
export class BunnyTokenService {
  private readonly duracionSegundos = 60 * 60; // 1 hora de validez

  generarTokenReproduccion(bunnyVideoId: string, bunnyLibraryId: string, securityKey: string | undefined): TokenReproduccion {
    if (!securityKey) {
      // Ocurre si la libreria todavia no tiene cargada su "Token Authentication Key" en
      // BUNNY_STREAM_LIBRERIAS (Bunny Dashboard > Stream > libreria > Security). Mejor fallar
      // claro aca que devolver un link sin firmar que Bunny terminaria aceptando igual.
      throw new InternalServerErrorException(
        'Esta libreria de Bunny Stream todavia no tiene configurada la Security Key (Token Authentication) en el backend.',
      );
    }

    const expires = Math.floor(Date.now() / 1000) + this.duracionSegundos;

    // Algoritmo oficial de Bunny Stream Token Authentication: sha256(security_key + video_id + expires).
    const hashable = `${securityKey}${bunnyVideoId}${expires}`;
    const token = crypto.createHash('sha256').update(hashable).digest('hex');

    const url = `https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${bunnyVideoId}?token=${token}&expires=${expires}`;

    return { url, expires };
  }
}
