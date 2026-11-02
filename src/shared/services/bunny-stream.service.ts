import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { envs } from 'src/config/envs';

export interface CredencialesBunnyStream {
  libraryId: string;
  apiKey: string;
}

/** Quita tildes y pasa a minúsculas, para comparar "Niños" con "niños" o "Peligros Digitales" con "peligros digitales". */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Sube videos a Bunny Stream (producto distinto a Bunny Storage, que es el que usan las
 * imagenes de cursos/categorias). El flujo oficial de Bunny es en 2 pasos: primero se crea
 * el "objeto" de video (POST, devuelve un guid) y despues se sube el archivo a ese guid (PUT).
 *
 * Hay 12 bibliotecas distintas, una por cada combinacion Categoria (Niños/Jovenes/Padres) x
 * Galaxia (salud social/peligros digitales/salud fisica/salud mental) -- vienen todas juntas
 * en BUNNY_STREAM_LIBRERIAS (un solo JSON en el .env). "resolverLibreria" las busca.
 */
@Injectable()
export class BunnyStreamService {
  private libreriasCache: Record<string, Record<string, CredencialesBunnyStream>> | null = null;

  private librerias(): Record<string, Record<string, CredencialesBunnyStream>> {
    if (this.libreriasCache) return this.libreriasCache;

    if (!envs.bunnyStreamLibrerias) {
      throw new InternalServerErrorException('Falta configurar BUNNY_STREAM_LIBRERIAS en el backend.');
    }

    let crudo: Record<string, Record<string, CredencialesBunnyStream>>;
    try {
      crudo = JSON.parse(envs.bunnyStreamLibrerias);
    } catch {
      throw new InternalServerErrorException('BUNNY_STREAM_LIBRERIAS no es un JSON válido.');
    }

    // Se indexa normalizado (sin tildes, minúsculas) para no depender de que categoria/galaxia
    // vengan con exactamente la misma mayúscula/tilde que se usó al escribir el JSON.
    const normalizado: Record<string, Record<string, CredencialesBunnyStream>> = {};
    for (const [categoria, galaxias] of Object.entries(crudo)) {
      normalizado[normalizar(categoria)] = {};
      for (const [galaxia, credenciales] of Object.entries(galaxias)) {
        normalizado[normalizar(categoria)][normalizar(galaxia)] = credenciales;
      }
    }

    this.libreriasCache = normalizado;
    return normalizado;
  }

  /** Busca la biblioteca de Bunny Stream que corresponde a una categoría y galaxia de un curso. */
  resolverLibreria(categoriaNombre: string, galaxiaNombre: string): CredencialesBunnyStream {
    const porCategoria = this.librerias()[normalizar(categoriaNombre)];
    const credenciales = porCategoria?.[normalizar(galaxiaNombre)];
    if (!credenciales) {
      throw new BadRequestException(
        `No hay una biblioteca de Bunny Stream configurada para Categoría "${categoriaNombre}" x Galaxia "${galaxiaNombre}".`,
      );
    }
    return credenciales;
  }

  /** Crea el objeto de video en Bunny Stream y devuelve su id (guid). */
  private async crearVideo(credenciales: CredencialesBunnyStream, titulo: string): Promise<string> {
    const respuesta = await fetch(`https://video.bunnycdn.com/library/${credenciales.libraryId}/videos`, {
      method: 'POST',
      headers: { AccessKey: credenciales.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titulo }),
    });

    if (!respuesta.ok) {
      const cuerpo = await respuesta.text().catch(() => '');
      throw new BadRequestException(`Fallo al crear el video en Bunny Stream: HTTP ${respuesta.status} ${cuerpo}`.trim());
    }

    const data = (await respuesta.json()) as { guid?: string };
    if (!data.guid) {
      throw new BadRequestException('Bunny Stream no devolvio el id del video creado.');
    }
    return data.guid;
  }

  /** Sube el archivo binario al video ya creado. */
  private async subirArchivo(credenciales: CredencialesBunnyStream, videoId: string, buffer: Buffer): Promise<void> {
    const respuesta = await fetch(`https://video.bunnycdn.com/library/${credenciales.libraryId}/videos/${videoId}`, {
      method: 'PUT',
      headers: { AccessKey: credenciales.apiKey, 'Content-Type': 'application/octet-stream' },
      body: new Uint8Array(buffer),
    });

    if (!respuesta.ok) {
      const cuerpo = await respuesta.text().catch(() => '');
      throw new BadRequestException(`Fallo al subir el video a Bunny Stream: HTTP ${respuesta.status} ${cuerpo}`.trim());
    }
  }

  /** Crea el video y sube el archivo en la biblioteca indicada. Devuelve el id (guid) del video. */
  async subirVideo(credenciales: CredencialesBunnyStream, titulo: string, buffer: Buffer): Promise<string> {
    const videoId = await this.crearVideo(credenciales, titulo);
    await this.subirArchivo(credenciales, videoId, buffer);
    return videoId;
  }
}
