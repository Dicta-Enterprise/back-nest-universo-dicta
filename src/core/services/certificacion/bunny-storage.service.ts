import { HttpStatus, Injectable } from '@nestjs/common';
import { TipoCertificacion } from '@prisma/client';
import { createHash } from 'crypto';
import { envs } from 'src/config/envs';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

const TIEMPO_MAXIMO_MS = 30_000;

interface ZonaBunny {
  nombre: string;
  clave?: string;
}

// Guarda los PDF de los certificados en Bunny Storage, una zona por tipo de certificado.
// Las zonas no son públicas: el backend descarga con la clave y entrega el PDF a quien tenga permiso
@Injectable()
export class BunnyStorageService {
  private readonly zonas: Record<TipoCertificacion, ZonaBunny> = {
    [TipoCertificacion.NINO]: {
      nombre: envs.bunnyStorageZonaNinos,
      clave: envs.bunnyStorageClaveNinos,
    },
    [TipoCertificacion.JOVEN]: {
      nombre: envs.bunnyStorageZonaJovenes,
      clave: envs.bunnyStorageClaveJovenes,
    },
    [TipoCertificacion.RECONOCIMIENTO]: {
      nombre: envs.bunnyStorageZonaPadres,
      clave: envs.bunnyStorageClavePadres,
    },
  };

  // Sin clave en el .env el PDF se sigue generando al descargar, solo que no se guarda
  estaConfigurado(tipo: TipoCertificacion): boolean {
    return Boolean(this.zonas[tipo].clave);
  }

  // Devuelve la URL del archivo (solo sirve con la clave de la zona)
  async subir(
    tipo: TipoCertificacion,
    carpetas: string[],
    nombreArchivo: string,
    contenido: Buffer,
  ): Promise<string> {
    const zona = this.zonas[tipo];
    const ruta = [...carpetas, nombreArchivo].map(encodeURIComponent).join('/');
    const url = `https://${envs.bunnyStorageHost}/${encodeURIComponent(zona.nombre)}/${ruta}`;

    const respuesta = await this.llamar(url, zona, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        // Bunny rechaza el archivo si llega distinto a lo que se mandó
        Checksum: createHash('sha256').update(contenido).digest('hex').toUpperCase(),
      },
      body: new Uint8Array(contenido),
    });
    if (respuesta.status !== HttpStatus.CREATED) {
      throw this.error(`Bunny respondió ${respuesta.status} al subir el PDF`);
    }

    return url;
  }

  // null si el archivo ya no está en Bunny
  async descargar(url: string): Promise<Buffer | null> {
    const zona = this.zonaDeUrl(url);
    const respuesta = await this.llamar(url, zona, { method: 'GET' });

    if (respuesta.status === HttpStatus.NOT_FOUND) return null;
    if (!respuesta.ok) {
      throw this.error(`Bunny respondió ${respuesta.status} al descargar el PDF`);
    }

    return Buffer.from(await respuesta.arrayBuffer());
  }

  // La clave solo se manda al host de Bunny configurado, nunca a otro que venga en la URL
  private zonaDeUrl(url: string): ZonaBunny {
    const { hostname, pathname } = new URL(url);
    const nombre = decodeURIComponent(pathname.split('/')[1] ?? '');
    const zona = Object.values(this.zonas).find(
      (z) => z.nombre === nombre && z.clave,
    );

    if (hostname !== envs.bunnyStorageHost || !zona) {
      throw this.error(`No hay clave configurada para la zona de ${url}`);
    }
    return zona;
  }

  private async llamar(
    url: string,
    zona: ZonaBunny,
    opciones: RequestInit,
  ): Promise<Response> {
    if (!zona.clave) {
      throw this.error(`La zona ${zona.nombre} no tiene clave configurada`);
    }

    try {
      return await fetch(url, {
        ...opciones,
        headers: { ...opciones.headers, AccessKey: zona.clave },
        signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
      });
    } catch (error) {
      throw this.error(
        `No se pudo conectar con Bunny: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private error(mensaje: string): BussinesRuleException {
    return new BussinesRuleException(mensaje, HttpStatus.BAD_GATEWAY, {
      codigoError: 'BUNNY_NO_DISPONIBLE',
    });
  }
}
