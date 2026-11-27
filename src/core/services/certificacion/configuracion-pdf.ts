import { HttpStatus } from '@nestjs/common';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

/*
 * Dónde va cada dato sobre el PDF base de la plantilla. Se guarda en
 * plantilla.configuracion.pdf (el resto de la configuración no se toca).
 *
 * Medidas en puntos (1 pt = 1/72 pulgada; un A4 horizontal mide 842 x 595).
 * x e y se miden desde la esquina superior izquierda de la página:
 *  - en un texto, y es la línea base de la letra; x depende de la alineación
 *    (izquierda = inicio, centro = centro, derecha = final del texto)
 *  - en el QR, (x, y) es su esquina superior izquierda
 *
 * Opcionales de cada texto: color, fuente, alineacion, anchoMaximo, prefijo
 * (texto fijo antes del dato, ej. "ID ") y, solo en fechaEmision, formatoFecha
 * ("largo" = 8 de noviembre de 2026, "numerico" = 08 · 11 · 2026).
 * En el QR, fondo es el cuadrado detrás del código: un color, o null si el
 * diseño ya trae su recuadro claro.
 *
 * Ejemplo:
 * {
 *   "pdf": {
 *     "campos": {
 *       "nombreTitular": { "x": 421, "y": 300, "tamano": 32, "fuente": "helvetica-negrita", "alineacion": "centro", "anchoMaximo": 600 },
 *       "nombreCurso": { "x": 421, "y": 360, "tamano": 18, "alineacion": "centro" },
 *       "fechaEmision": { "x": 120, "y": 520, "tamano": 12, "formatoFecha": "numerico" },
 *       "codigoCertificado": { "x": 120, "y": 540, "tamano": 10, "color": "#555555", "prefijo": "ID " }
 *     },
 *     "qr": { "x": 700, "y": 440, "tamano": 100, "fondo": null }
 *   }
 * }
 */

export const FUENTES_PDF = [
  'helvetica',
  'helvetica-negrita',
  'times',
  'times-negrita',
  'times-cursiva',
  'times-negrita-cursiva',
  'courier',
] as const;
export const ALINEACIONES_PDF = ['izquierda', 'centro', 'derecha'] as const;
export const FORMATOS_FECHA = ['largo', 'numerico'] as const;
export const CAMPOS_PDF = [
  'nombreTitular',
  'nombreCurso',
  'fechaEmision',
  'codigoCertificado',
] as const;

export type FuentePdf = (typeof FUENTES_PDF)[number];
export type AlineacionPdf = (typeof ALINEACIONES_PDF)[number];
export type CampoPdf = (typeof CAMPOS_PDF)[number];
export type FormatoFecha = (typeof FORMATOS_FECHA)[number];

export interface TextoPdf {
  x: number;
  y: number;
  tamano: number;
  color: string;
  fuente: FuentePdf;
  alineacion: AlineacionPdf;
  // Si el texto es más ancho, se achica la letra hasta que entre
  anchoMaximo: number | null;
  prefijo: string;
  formatoFecha: FormatoFecha;
}

export interface QrPdf {
  x: number;
  y: number;
  tamano: number;
  color: string;
  fondo: string | null;
}

export interface ConfiguracionPdf {
  pagina: number;
  campos: Partial<Record<CampoPdf, TextoPdf>>;
  qr: QrPdf;
}

const COLOR_HEX = /^#[0-9a-fA-F]{6}$/;
const COLOR_POR_DEFECTO = '#000000';

export function leerConfiguracionPdf(
  configuracion: Record<string, unknown> | null,
): ConfiguracionPdf {
  const errores: string[] = [];
  const pdf = configuracion?.pdf;

  if (!esObjeto(pdf)) {
    throw errorConfiguracion(['Falta el objeto "pdf" en la configuración de la plantilla']);
  }

  const pagina = pdf.pagina ?? 0;
  if (!Number.isInteger(pagina) || (pagina as number) < 0) {
    errores.push('pdf.pagina debe ser un entero desde 0');
  }

  const campos: Partial<Record<CampoPdf, TextoPdf>> = {};
  if (!esObjeto(pdf.campos)) {
    errores.push('Falta pdf.campos');
  } else {
    for (const nombre of Object.keys(pdf.campos)) {
      if (!(CAMPOS_PDF as readonly string[]).includes(nombre)) {
        errores.push(`pdf.campos.${nombre} no existe (válidos: ${CAMPOS_PDF.join(', ')})`);
      }
    }
    for (const nombre of CAMPOS_PDF) {
      const campo = pdf.campos[nombre];
      if (campo !== undefined) {
        campos[nombre] = leerTexto(campo, `pdf.campos.${nombre}`, errores);
      }
    }
    if (!pdf.campos.nombreTitular) {
      errores.push('pdf.campos.nombreTitular es obligatorio');
    }
  }

  const qr = leerQr(pdf.qr, errores);

  if (errores.length > 0) throw errorConfiguracion(errores);

  return { pagina: pagina as number, campos, qr: qr as QrPdf };
}

function leerTexto(valor: unknown, ruta: string, errores: string[]): TextoPdf {
  if (!esObjeto(valor)) {
    errores.push(`${ruta} debe ser un objeto`);
    return valor as TextoPdf;
  }

  verificarMedida(valor.x, `${ruta}.x`, errores);
  verificarMedida(valor.y, `${ruta}.y`, errores);
  verificarMedida(valor.tamano, `${ruta}.tamano`, errores, true);
  if (valor.anchoMaximo !== undefined) {
    verificarMedida(valor.anchoMaximo, `${ruta}.anchoMaximo`, errores, true);
  }
  verificarColor(valor.color, `${ruta}.color`, errores);
  verificarOpcion(valor.fuente, FUENTES_PDF, `${ruta}.fuente`, errores);
  verificarOpcion(valor.alineacion, ALINEACIONES_PDF, `${ruta}.alineacion`, errores);
  verificarOpcion(valor.formatoFecha, FORMATOS_FECHA, `${ruta}.formatoFecha`, errores);
  if (
    valor.prefijo !== undefined &&
    (typeof valor.prefijo !== 'string' || valor.prefijo.length > 100)
  ) {
    errores.push(`${ruta}.prefijo debe ser un texto de hasta 100 caracteres`);
  }

  return {
    x: valor.x as number,
    y: valor.y as number,
    tamano: valor.tamano as number,
    color: (valor.color as string) ?? COLOR_POR_DEFECTO,
    fuente: (valor.fuente as FuentePdf) ?? 'helvetica',
    alineacion: (valor.alineacion as AlineacionPdf) ?? 'izquierda',
    anchoMaximo: (valor.anchoMaximo as number) ?? null,
    prefijo: (valor.prefijo as string) ?? '',
    formatoFecha: (valor.formatoFecha as FormatoFecha) ?? 'largo',
  };
}

function leerQr(valor: unknown, errores: string[]): QrPdf | null {
  if (!esObjeto(valor)) {
    errores.push('pdf.qr es obligatorio (lleva a la página de validación)');
    return null;
  }

  verificarMedida(valor.x, 'pdf.qr.x', errores);
  verificarMedida(valor.y, 'pdf.qr.y', errores);
  verificarMedida(valor.tamano, 'pdf.qr.tamano', errores, true);
  verificarColor(valor.color, 'pdf.qr.color', errores);
  if (valor.fondo !== null) {
    verificarColor(valor.fondo, 'pdf.qr.fondo', errores);
  }

  return {
    x: valor.x as number,
    y: valor.y as number,
    tamano: valor.tamano as number,
    color: (valor.color as string) ?? COLOR_POR_DEFECTO,
    fondo:
      valor.fondo === null ? null : ((valor.fondo as string) ?? '#FFFFFF'),
  };
}

function verificarMedida(
  valor: unknown,
  ruta: string,
  errores: string[],
  mayorACero = false,
): void {
  const valido =
    typeof valor === 'number' &&
    Number.isFinite(valor) &&
    (mayorACero ? valor > 0 : valor >= 0);
  if (!valido) {
    errores.push(`${ruta} debe ser un número ${mayorACero ? 'mayor a 0' : 'desde 0'}`);
  }
}

function verificarColor(valor: unknown, ruta: string, errores: string[]): void {
  if (valor !== undefined && (typeof valor !== 'string' || !COLOR_HEX.test(valor))) {
    errores.push(`${ruta} debe tener el formato #RRGGBB`);
  }
}

function verificarOpcion(
  valor: unknown,
  opciones: readonly string[],
  ruta: string,
  errores: string[],
): void {
  if (valor !== undefined && !opciones.includes(valor as string)) {
    errores.push(`${ruta} debe ser uno de: ${opciones.join(', ')}`);
  }
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function errorConfiguracion(errores: string[]): BussinesRuleException {
  return new BussinesRuleException(
    'La configuración de la plantilla no sirve para generar el PDF',
    HttpStatus.UNPROCESSABLE_ENTITY,
    { errores, codigoError: 'PLANTILLA_CONFIGURACION_PDF_INVALIDA' },
  );
}
