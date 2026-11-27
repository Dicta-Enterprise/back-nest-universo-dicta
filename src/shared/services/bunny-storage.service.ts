import { BadRequestException, Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';

/**
 * Datos de una zona de almacenamiento de Bunny: su nombre, su contraseña (AccessKey)
 * y la URL pública donde se sirven sus archivos (la Pull Zone / CDN).
 *
 * OJO: al 1-oct-2026 ninguna de las dos zonas (cursos, texturas) tiene todavía una Pull Zone
 * creada en Bunny. BUNNY_CURSOS_CDN_URL y BUNNY_TEXTURAS_CDN_URL son, por ahora, un supuesto
 * (el mismo nombre de la zona, que es la convención más común al crear una Pull Zone), pero
 * hay que confirmarlo con Carlos y corregir el .env en cuanto la Pull Zone exista de verdad.
 * Mientras tanto, subir y borrar funciona (se probó con curl), pero la URL guardada no va a
 * cargar en un navegador hasta que la Pull Zone quede creada.
 */
export interface ZonaBunny {
  nombre: string;
  password: string;
  cdnUrl: string;
}

export const ZONA_CURSOS: ZonaBunny = {
  nombre: envs.bunnyCursosZone,
  password: envs.bunnyCursosPassword,
  cdnUrl: envs.bunnyCursosCdnUrl,
};

export const ZONA_TEXTURAS: ZonaBunny = {
  nombre: envs.bunnyTexturasZone,
  password: envs.bunnyTexturasPassword,
  cdnUrl: envs.bunnyTexturasCdnUrl,
};

@Injectable()
export class BunnyStorageService {
  /**
   * Sube un archivo a una ruta dentro de una zona de Bunny. La carpeta se arma sola con la
   * ruta (Bunny no tiene un paso aparte para "crear carpeta"). Devuelve la URL pública (CDN)
   * donde debería quedar visible una vez exista la Pull Zone de esa zona.
   */
  async subirArchivo(zona: ZonaBunny, rutaConNombre: string, buffer: Buffer, contentType: string): Promise<string> {
    const url = `${envs.bunnyStorageEndpoint}/${zona.nombre}/${rutaConNombre}`;
    const respuesta = await fetch(url, {
      method: 'PUT',
      headers: { AccessKey: zona.password, 'Content-Type': contentType },
      body: new Uint8Array(buffer),
    });

    if (!respuesta.ok) {
      const cuerpo = await respuesta.text().catch(() => '');
      throw new BadRequestException(
        `Fallo al subir el archivo a Bunny (${zona.nombre}): HTTP ${respuesta.status} ${cuerpo}`.trim(),
      );
    }

    return `${zona.cdnUrl}/${rutaConNombre}`;
  }

  /** Borra un archivo de una zona de Bunny. No lanza error si el archivo ya no existe. */
  async borrarArchivo(zona: ZonaBunny, rutaConNombre: string): Promise<void> {
    const url = `${envs.bunnyStorageEndpoint}/${zona.nombre}/${rutaConNombre}`;
    const respuesta = await fetch(url, { method: 'DELETE', headers: { AccessKey: zona.password } });
    if (!respuesta.ok && respuesta.status !== 404) {
      const cuerpo = await respuesta.text().catch(() => '');
      throw new BadRequestException(
        `Fallo al borrar el archivo en Bunny (${zona.nombre}): HTTP ${respuesta.status} ${cuerpo}`.trim(),
      );
    }
  }
}
