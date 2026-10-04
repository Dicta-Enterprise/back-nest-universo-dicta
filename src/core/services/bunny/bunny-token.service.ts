import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { envs } from 'src/config/envs';

export interface TokenReproduccion {
  url: string;
  expires: number;
}

@Injectable()
export class BunnyTokenService {
  private readonly duracionSegundos = 60 * 60; // 1 hora de validez

  generarTokenReproduccion(bunnyVideoId: string): TokenReproduccion {
    const expires = Math.floor(Date.now() / 1000) + this.duracionSegundos;

    // Algoritmo de "Token Authentication" de Bunny Stream: sha256(security_key + video_id + expires).
    // Verificar contra la documentación oficial de Bunny cuando exista una librería real de Carlos.
    const hashable = `${envs.bunnyTokenAuthKey}${bunnyVideoId}${expires}`;
    const token = crypto.createHash('sha256').update(hashable).digest('hex');

    const url = `https://iframe.mediadelivery.net/embed/${envs.bunnyLibraryId}/${bunnyVideoId}?token=${token}&expires=${expires}`;

    return { url, expires };
  }
}
