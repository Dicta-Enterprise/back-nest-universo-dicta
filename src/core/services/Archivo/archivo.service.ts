/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

export interface OpcionesArchivo {
  carpeta: string; // 'imagenes', 'modelos', 'documentos', etc.
  extensionesPermitidas: string[]; // ['.jpg', '.png', '.glb', etc.]
  tamanoMaximo?: number; // en bytes
  prefijo?: string; // 'categoria', 'producto', etc.
}

export interface ResultadoArchivo {
  url: string; // URL pública para acceder al archivo
  nombreArchivo: string; // Nombre del archivo guardado
  rutaCompleta: string; // Ruta física completa
}

@Injectable()
export class ArchivoService {
  private readonly baseUploadPath = path.join(process.cwd(), 'uploads');
  private readonly basePublicUrl = '/uploads';

  constructor() {
    this.ensureBaseDirectory();
  }

  // Asegurar que el directorio base de uploads existe
  private async ensureBaseDirectory() {
    try {
      if (!existsSync(this.baseUploadPath)) {
        await fs.mkdir(this.baseUploadPath, { recursive: true });
      }
    } catch (error) {
      console.error('Error creando directorio base de uploads:', error);
    }
  }

  /**
   * Asegura que existe el directorio específico para un tipo de archivo
   */
  private async ensureDirectory(carpeta: string): Promise<void> {
    const dirPath = path.join(this.baseUploadPath, carpeta);
    if (!existsSync(dirPath)) {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Valida un archivo según las opciones proporcionadas
   */
  private validarArchivo(file: Express.Multer.File, opciones: OpcionesArchivo): void {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar extensión
    const extension = path.extname(file.originalname).toLowerCase();
    if (!opciones.extensionesPermitidas.includes(extension)) {
      throw new BadRequestException(
        `Solo se permiten archivos con extensiones: ${opciones.extensionesPermitidas.join(', ')}`,
      );
    }

    // Validar tamaño
    if (opciones.tamanoMaximo && file.size > opciones.tamanoMaximo) {
      const tamanoMB = (opciones.tamanoMaximo / (1024 * 1024)).toFixed(2);
      throw new BadRequestException(
        `El archivo excede el tamaño máximo permitido de ${tamanoMB}MB`,
      );
    }
  }

  /**
   * Genera un nombre único para el archivo
   */
  private generarNombreArchivo(
    file: Express.Multer.File,
    opciones: OpcionesArchivo,
    identificador?: string,
  ): string {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    const prefijo = opciones.prefijo || 'archivo';
    const id = identificador || timestamp.toString();

    return `${prefijo}-${id}-${timestamp}${extension}`;
  }

  /**
   * Sube un archivo al sistema
   * @param file Archivo a subir
   * @param opciones Configuración de subida
   * @param identificador ID opcional para el nombre del archivo (ej: categoriaId)
   * @returns Información del archivo subido
   */
  async subirArchivo(
    file: Express.Multer.File,
    opciones: OpcionesArchivo,
    identificador?: string,
  ): Promise<ResultadoArchivo> {
    // Validar archivo
    this.validarArchivo(file, opciones);

    // Asegurar que existe el directorio
    await this.ensureDirectory(opciones.carpeta);

    // Generar nombre y rutas
    const nombreArchivo = this.generarNombreArchivo(file, opciones, identificador);
    const rutaCompleta = path.join(this.baseUploadPath, opciones.carpeta, nombreArchivo);
    const url = `${this.basePublicUrl}/${opciones.carpeta}/${nombreArchivo}`;

    // Guardar archivo
    await fs.writeFile(rutaCompleta, file.buffer);

    return {
      url,
      nombreArchivo,
      rutaCompleta,
    };
  }

  /**
   * Actualiza un archivo (elimina el anterior y sube el nuevo)
   * @param urlAnterior URL del archivo anterior a eliminar
   * @param file Nuevo archivo
   * @param opciones Configuración de subida
   * @param identificador ID opcional para el nombre del archivo
   * @returns Información del nuevo archivo
   */
  async actualizarArchivo(
    urlAnterior: string | null,
    file: Express.Multer.File,
    opciones: OpcionesArchivo,
    identificador?: string,
  ): Promise<ResultadoArchivo> {
    // Eliminar archivo anterior si existe
    if (urlAnterior) {
      await this.eliminarArchivo(urlAnterior);
    }

    // Subir nuevo archivo
    return this.subirArchivo(file, opciones, identificador);
  }

  /**
   * Elimina un archivo del sistema usando su URL pública
   * @param url URL pública del archivo
   */
  async eliminarArchivo(url: string): Promise<void> {
    try {
      // Convertir URL pública a ruta física
      const rutaRelativa = url.replace(this.basePublicUrl, '');
      const rutaCompleta = path.join(this.baseUploadPath, rutaRelativa);

      // Verificar y eliminar si existe
      if (existsSync(rutaCompleta)) {
        await fs.unlink(rutaCompleta);
      }
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      // No lanzamos error para no bloquear operaciones
    }
  }

  /**
   * Elimina un archivo usando su ruta completa
   * @param rutaCompleta Ruta física completa del archivo
   */
  async eliminarArchivoPorRuta(rutaCompleta: string): Promise<void> {
    try {
      if (existsSync(rutaCompleta)) {
        await fs.unlink(rutaCompleta);
      }
    } catch (error) {
      console.error('Error eliminando archivo por ruta:', error);
    }
  }

  /**
   * Verifica si un archivo existe
   * @param url URL pública del archivo
   * @returns true si el archivo existe
   */
  async existeArchivo(url: string): Promise<boolean> {
    try {
      const rutaRelativa = url.replace(this.basePublicUrl, '');
      const rutaCompleta = path.join(this.baseUploadPath, rutaRelativa);
      return existsSync(rutaCompleta);
    } catch (error) {
      return false;
    }
  }

  /**
   * Limpia archivos huérfanos en una carpeta específica
   * @param carpeta Nombre de la carpeta a limpiar
   * @param urlsEnUso Array de URLs que están en uso
   * @returns Cantidad de archivos eliminados
   */
  async limpiarArchivosHuerfanos(carpeta: string, urlsEnUso: string[]): Promise<number> {
    try {
      const dirPath = path.join(this.baseUploadPath, carpeta);
      
      if (!existsSync(dirPath)) {
        return 0;
      }

      const archivos = await fs.readdir(dirPath);
      const nombresEnUso = new Set(
        urlsEnUso.map((url) => url.split('/').pop()).filter(Boolean),
      );

      let eliminados = 0;
      for (const archivo of archivos) {
        if (!nombresEnUso.has(archivo)) {
          await fs.unlink(path.join(dirPath, archivo));
          eliminados++;
        }
      }

      return eliminados;
    } catch (error) {
      console.error('Error limpiando archivos huérfanos:', error);
      return 0;
    }
  }

  /**
   * Obtiene información de un archivo por su URL
   * @param url URL pública del archivo
   * @returns Información del archivo o null si no existe
   */
  async obtenerInfoArchivo(url: string): Promise<{
    existe: boolean;
    tamano?: number;
    extension?: string;
  }> {
    try {
      const rutaRelativa = url.replace(this.basePublicUrl, '');
      const rutaCompleta = path.join(this.baseUploadPath, rutaRelativa);

      if (!existsSync(rutaCompleta)) {
        return { existe: false };
      }

      const stats = await fs.stat(rutaCompleta);
      const extension = path.extname(rutaCompleta).toLowerCase();

      return {
        existe: true,
        tamano: stats.size,
        extension,
      };
    } catch (error) {
      return { existe: false };
    }
  }
}

// Opciones predefinidas comunes
export const OpcionesImagenes: OpcionesArchivo = {
  carpeta: 'imagenes',
  extensionesPermitidas: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  tamanoMaximo: 5 * 1024 * 1024, // 5MB
  prefijo: 'img',
};

export const OpcionesModelos3D: OpcionesArchivo = {
  carpeta: 'modelos',
  extensionesPermitidas: ['.glb', '.gltf'],
  tamanoMaximo: 50 * 1024 * 1024, // 50MB
  prefijo: 'modelo',
};

export const OpcionesDocumentos: OpcionesArchivo = {
  carpeta: 'documentos',
  extensionesPermitidas: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  tamanoMaximo: 10 * 1024 * 1024, // 10MB
  prefijo: 'doc',
};

export const OpcionesVideos: OpcionesArchivo = {
  carpeta: 'videos',
  extensionesPermitidas: ['.mp4', '.webm', '.mov'],
  tamanoMaximo: 100 * 1024 * 1024, // 100MB
  prefijo: 'video',
};