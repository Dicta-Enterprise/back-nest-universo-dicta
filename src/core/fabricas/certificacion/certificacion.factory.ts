import { Certificacion as PrismaCertificacion } from '@prisma/client';
import { Certificacion } from 'src/core/entities/certificacion/certificacion.entity';

export interface CertificacionFactory {
  crearDesdePrisma(prisma: PrismaCertificacion): Certificacion;
}

export class DefaultCertificacionFactory implements CertificacionFactory {
  crearDesdePrisma(prisma: PrismaCertificacion): Certificacion {
    return new Certificacion(
      prisma.id,
      prisma.idUsuario,
      prisma.idCuentaAsociada,
      prisma.idCurso,
      prisma.idPlantilla,
      prisma.codigoCertificado,
      prisma.nombreCertificado,
      prisma.nombreTitular,
      prisma.tipoCertificacion,
      prisma.fechaEmision,
      prisma.urlCertificado,
      prisma.urlCodigoQr,
      prisma.configuracionSnapshot as Record<string, unknown> | null,
      prisma.urlPlantillaSnapshot,
      prisma.estado,
      prisma.fechaAnulacion,
      prisma.motivoAnulacion,
      prisma.idUsuarioAnulacion,
      prisma.idCertificadoReemplazo,
      prisma.estadoBlockchain,
      prisma.walletDestino,
      prisma.uriMetadatos,
      prisma.tokenId,
      prisma.txHash,
      prisma.fechaRegistroBlockchain,
      prisma.errorBlockchain,
      prisma.txHashRevocacion,
      prisma.fechaCreacion,
      prisma.fechaActualizacion,
    );
  }
}
