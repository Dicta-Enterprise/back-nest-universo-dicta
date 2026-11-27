import { EstadoBlockchain, TipoCertificacion } from '@prisma/client';
import { Certificacion } from 'src/core/entities/certificacion/certificacion.entity';

export interface DatosNuevaCertificacion {
  idUsuario: number;
  idCuentaAsociada: number | null;
  idCurso: string;
  idPlantilla: string;
  codigoCertificado: string;
  nombreCertificado: string;
  nombreTitular: string;
  tipoCertificacion: TipoCertificacion;
  configuracionSnapshot: Record<string, unknown> | null;
  urlPlantillaSnapshot: string | null;
}

export interface DatosAnulacionCertificacion {
  motivoAnulacion: string;
  idUsuarioAnulacion: number;
  fechaAnulacion: Date;
}

export interface DatosBlockchainCertificacion {
  estadoBlockchain?: EstadoBlockchain;
  walletDestino?: string;
  uriMetadatos?: string;
  tokenId?: string;
  txHash?: string;
  fechaRegistroBlockchain?: Date;
  errorBlockchain?: string | null;
  txHashRevocacion?: string;
}

export interface CertificacionRepository {
  crear(datos: DatosNuevaCertificacion): Promise<Certificacion>;
  findById(id: string): Promise<Certificacion | null>;
  findByCodigo(codigoCertificado: string): Promise<Certificacion | null>;
  // El certificado anulado al que reemplaza este (si vino de una reemisión)
  findReemplazadoPor(idNuevo: string): Promise<Certificacion | null>;
  findEmitidaByTitularYCurso(
    idUsuario: number,
    idCuentaAsociada: number | null,
    idCurso: string,
    tipoCertificacion: TipoCertificacion,
  ): Promise<Certificacion | null>;
  findAllByUsuario(idUsuario: number): Promise<Certificacion[]>;
  findAllByCuentaAsociada(idCuentaAsociada: number): Promise<Certificacion[]>;
  // Devuelven null si el certificado ya no estaba EMITIDA (otro admin se adelantó)
  anular(
    id: string,
    datos: DatosAnulacionCertificacion,
  ): Promise<Certificacion | null>;
  // Crea el nuevo y anula el anterior en una sola transacción; devuelve el nuevo
  reemitir(
    idAnterior: string,
    anulacion: DatosAnulacionCertificacion,
    nueva: DatosNuevaCertificacion,
  ): Promise<Certificacion | null>;
  actualizarBlockchain(
    id: string,
    datos: DatosBlockchainCertificacion,
  ): Promise<Certificacion>;
  guardarUrlCertificado(id: string, urlCertificado: string): Promise<void>;
}
