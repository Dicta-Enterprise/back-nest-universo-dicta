import {
  EstadoBlockchain,
  EstadoCertificacion,
  TipoCertificacion,
} from '@prisma/client';

export class Certificacion {
  constructor(
    public id: string,
    public idUsuario: number,
    public idCuentaAsociada: number | null,
    public idCurso: string,
    public idPlantilla: string,
    public codigoCertificado: string,
    public nombreCertificado: string,
    public nombreTitular: string,
    public tipoCertificacion: TipoCertificacion,
    public fechaEmision: Date,
    public urlCertificado: string | null,
    public urlCodigoQr: string | null,
    public configuracionSnapshot: Record<string, unknown> | null,
    public urlPlantillaSnapshot: string | null,
    public estado: EstadoCertificacion,
    public fechaAnulacion: Date | null,
    public motivoAnulacion: string | null,
    public idUsuarioAnulacion: number | null,
    public idCertificadoReemplazo: string | null,
    public estadoBlockchain: EstadoBlockchain,
    public walletDestino: string | null,
    public uriMetadatos: string | null,
    public tokenId: string | null,
    public txHash: string | null,
    public fechaRegistroBlockchain: Date | null,
    public errorBlockchain: string | null,
    public txHashRevocacion: string | null,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
  ) {}
}
