import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
  RGB,
  StandardFonts,
} from 'pdf-lib';
import * as QRCode from 'qrcode';
import { envs } from 'src/config/envs';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { BunnyStorageService } from './bunny-storage.service';
import {
  CampoPdf,
  CAMPOS_PDF,
  FormatoFecha,
  FuentePdf,
  leerConfiguracionPdf,
  QrPdf,
  TextoPdf,
} from './configuracion-pdf';

// El certificado se imprime: no puede pasar de 500 KB
export const LIMITE_PDF_BYTES = 500 * 1024;

const TIEMPO_MAXIMO_DESCARGA_MS = 15_000;
const MAXIMO_PLANTILLAS_EN_MEMORIA = 10;
// Borde blanco alrededor del QR, en módulos (cuadraditos), para que se pueda escanear
const MARGEN_QR_MODULOS = 2;
const ZONA_HORARIA = 'America/Lima';

const FUENTES: Record<FuentePdf, StandardFonts> = {
  helvetica: StandardFonts.Helvetica,
  'helvetica-negrita': StandardFonts.HelveticaBold,
  times: StandardFonts.TimesRoman,
  'times-negrita': StandardFonts.TimesRomanBold,
  'times-cursiva': StandardFonts.TimesRomanItalic,
  'times-negrita-cursiva': StandardFonts.TimesRomanBoldItalic,
  courier: StandardFonts.Courier,
};

// Caracteres fuera de Latin-1 que las fuentes estándar del PDF sí tienen
const WIN_ANSI_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';

export interface DatosPdfCertificado {
  codigoCertificado: string;
  nombreTitular: string;
  nombreCurso: string;
  fechaEmision: Date;
  urlPlantilla: string;
  configuracion: Record<string, unknown> | null;
  urlVerificacion: string;
}

@Injectable()
export class CertificadoPdfService {
  private readonly logger = new Logger(CertificadoPdfService.name);
  // La URL de la plantilla queda fija en cada certificado, así que se puede guardar el archivo
  private readonly plantillas = new Map<string, Uint8Array>();

  constructor(private readonly bunnyStorageService: BunnyStorageService) {}

  async generar(datos: DatosPdfCertificado): Promise<Buffer> {
    const configuracion = leerConfiguracionPdf(datos.configuracion);
    const documento = await this.abrirBase(datos.urlPlantilla);

    const pagina = documento.getPages()[configuracion.pagina];
    if (!pagina) {
      throw new BussinesRuleException(
        'La configuración de la plantilla no sirve para generar el PDF',
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          errores: [
            `pdf.pagina ${configuracion.pagina} no existe: el archivo base tiene ${documento.getPageCount()} página(s)`,
          ],
          codigoError: 'PLANTILLA_CONFIGURACION_PDF_INVALIDA',
        },
      );
    }

    const fuentes = new Map<FuentePdf, PDFFont>();
    for (const campo of CAMPOS_PDF) {
      const config = configuracion.campos[campo];
      if (!config) continue;

      const textos: Record<CampoPdf, string> = {
        nombreTitular: datos.nombreTitular,
        nombreCurso: datos.nombreCurso,
        fechaEmision: formatearFecha(datos.fechaEmision, config.formatoFecha),
        codigoCertificado: datos.codigoCertificado,
      };

      let fuente = fuentes.get(config.fuente);
      if (!fuente) {
        fuente = await documento.embedFont(FUENTES[config.fuente]);
        fuentes.set(config.fuente, fuente);
      }
      this.dibujarTexto(
        pagina,
        fuente,
        textoCompatible(config.prefijo + textos[campo]),
        config,
      );
    }

    this.dibujarQr(pagina, datos.urlVerificacion, configuracion.qr);

    documento.setTitle(`Certificado ${datos.codigoCertificado}`);
    documento.setSubject(datos.nombreCurso);
    documento.setCreator('Mundo Dictariano');
    documento.setProducer('Mundo Dictariano');

    const bytes = await documento.save();
    if (bytes.length > LIMITE_PDF_BYTES) {
      throw new BussinesRuleException(
        'El PDF del certificado supera el límite de 500 KB. Hay que aligerar el archivo base de la plantilla.',
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          tamanoKb: Math.ceil(bytes.length / 1024),
          limiteKb: LIMITE_PDF_BYTES / 1024,
          codigoError: 'PDF_EXCEDE_TAMANO',
        },
      );
    }

    return Buffer.from(bytes);
  }

  private dibujarTexto(
    pagina: PDFPage,
    fuente: PDFFont,
    texto: string,
    config: TextoPdf,
  ): void {
    let tamano = config.tamano;
    let ancho = fuente.widthOfTextAtSize(texto, tamano);

    if (config.anchoMaximo && ancho > config.anchoMaximo) {
      tamano = (tamano * config.anchoMaximo) / ancho;
      ancho = config.anchoMaximo;
    }

    const desplazamiento =
      config.alineacion === 'centro'
        ? ancho / 2
        : config.alineacion === 'derecha'
          ? ancho
          : 0;

    pagina.drawText(texto, {
      x: config.x - desplazamiento,
      // pdf-lib mide desde abajo; la configuración, desde arriba
      y: pagina.getHeight() - config.y,
      size: tamano,
      font: fuente,
      color: aRgb(config.color),
    });
  }

  // Dibuja el QR como vector (no imagen): pesa muy poco y se imprime nítido
  private dibujarQr(pagina: PDFPage, url: string, config: QrPdf): void {
    const { modules } = QRCode.create(url, { errorCorrectionLevel: 'M' });
    const totalModulos = modules.size + MARGEN_QR_MODULOS * 2;

    // Une los cuadraditos oscuros seguidos de cada fila en un solo rectángulo
    let ruta = '';
    for (let fila = 0; fila < modules.size; fila++) {
      let columna = 0;
      while (columna < modules.size) {
        if (!modules.get(fila, columna)) {
          columna++;
          continue;
        }
        const inicio = columna;
        while (columna < modules.size && modules.get(fila, columna)) columna++;
        const largo = columna - inicio;
        ruta += `M${inicio + MARGEN_QR_MODULOS} ${fila + MARGEN_QR_MODULOS}h${largo}v1h-${largo}z`;
      }
    }

    const arriba = pagina.getHeight() - config.y;
    if (config.fondo) {
      pagina.drawRectangle({
        x: config.x,
        y: arriba - config.tamano,
        width: config.tamano,
        height: config.tamano,
        color: aRgb(config.fondo),
      });
    }
    pagina.drawSvgPath(ruta, {
      x: config.x,
      y: arriba,
      scale: config.tamano / totalModulos,
      color: aRgb(config.color),
    });
  }

  // El archivo base puede ser un PDF o una imagen PNG/JPG (se vuelve una página de su tamaño)
  private async abrirBase(url: string): Promise<PDFDocument> {
    const bytes = await this.obtenerArchivoBase(url);

    try {
      if (empiezaCon(bytes, [0x25, 0x50, 0x44, 0x46])) {
        return await PDFDocument.load(bytes);
      }

      const esPng = empiezaCon(bytes, [0x89, 0x50, 0x4e, 0x47]);
      const esJpg = empiezaCon(bytes, [0xff, 0xd8, 0xff]);
      if (esPng || esJpg) {
        const documento = await PDFDocument.create();
        const imagen = esPng
          ? await documento.embedPng(bytes)
          : await documento.embedJpg(bytes);
        const pagina = documento.addPage([imagen.width, imagen.height]);
        pagina.drawImage(imagen, {
          x: 0,
          y: 0,
          width: imagen.width,
          height: imagen.height,
        });
        return documento;
      }
    } catch (error) {
      this.logger.error(
        `No se pudo leer el archivo base de la plantilla ${url}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    throw new BussinesRuleException(
      'El archivo base de la plantilla no es un PDF, PNG o JPG válido',
      HttpStatus.UNPROCESSABLE_ENTITY,
      { codigoError: 'PLANTILLA_ARCHIVO_INVALIDO' },
    );
  }

  private async obtenerArchivoBase(url: string): Promise<Uint8Array> {
    const guardado = this.plantillas.get(url);
    if (guardado) return guardado;

    let bytes: Uint8Array;
    try {
      bytes = await this.descargarArchivoBase(url);
    } catch (error) {
      this.logger.error(
        `No se pudo descargar el archivo base de la plantilla ${url}`,
        error instanceof Error ? error.message : String(error),
      );
      throw new BussinesRuleException(
        'No se pudo descargar el archivo base de la plantilla',
        HttpStatus.BAD_GATEWAY,
        { codigoError: 'PLANTILLA_NO_DISPONIBLE' },
      );
    }

    if (bytes.length > LIMITE_PDF_BYTES) {
      throw new BussinesRuleException(
        'El archivo base de la plantilla ya supera el límite de 500 KB del certificado',
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          tamanoKb: Math.ceil(bytes.length / 1024),
          limiteKb: LIMITE_PDF_BYTES / 1024,
          codigoError: 'PLANTILLA_EXCEDE_TAMANO',
        },
      );
    }

    if (this.plantillas.size >= MAXIMO_PLANTILLAS_EN_MEMORIA) {
      const masAntigua = this.plantillas.keys().next().value;
      if (masAntigua !== undefined) this.plantillas.delete(masAntigua);
    }
    this.plantillas.set(url, bytes);

    return bytes;
  }

  // Los archivos base viven en Bunny (zonas privadas, se leen con la clave);
  // cualquier otra URL pública se descarga directo
  private async descargarArchivoBase(url: string): Promise<Uint8Array> {
    if (new URL(url).hostname === envs.bunnyStorageHost) {
      const contenido = await this.bunnyStorageService.descargar(url);
      if (!contenido) throw new Error('el archivo no está en Bunny');
      return new Uint8Array(contenido);
    }

    const respuesta = await fetch(url, {
      signal: AbortSignal.timeout(TIEMPO_MAXIMO_DESCARGA_MS),
    });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    return new Uint8Array(await respuesta.arrayBuffer());
  }
}

function formatearFecha(fecha: Date, formato: FormatoFecha): string {
  if (formato === 'numerico') {
    const partes = new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: ZONA_HORARIA,
    }).formatToParts(fecha);
    const parte = (tipo: string) =>
      partes.find((p) => p.type === tipo)?.value ?? '';
    return `${parte('day')} · ${parte('month')} · ${parte('year')}`;
  }

  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: ZONA_HORARIA,
  }).format(fecha);
}

// Las fuentes estándar del PDF no tienen emojis ni otros alfabetos: se reemplazan
// (las tildes y la ñ sí están)
function textoCompatible(texto: string): string {
  return Array.from(texto.normalize('NFC'))
    .map((caracter) => {
      const codigo = caracter.codePointAt(0) ?? 0;
      const esLatin1 =
        (codigo >= 0x20 && codigo <= 0x7e) || (codigo >= 0xa0 && codigo <= 0xff);
      if (esLatin1 || WIN_ANSI_EXTRA.includes(caracter)) return caracter;

      // Letra con un acento raro (ej. "ř") → sin el acento; emoji u otro alfabeto → se quita
      const sinTilde = caracter.normalize('NFD').replace(/\p{M}/gu, '');
      return /^[\x20-\x7e]+$/.test(sinTilde) ? sinTilde : '';
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function aRgb(hex: string): RGB {
  return rgb(
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  );
}

function empiezaCon(bytes: Uint8Array, firma: number[]): boolean {
  return firma.every((valor, i) => bytes[i] === valor);
}
