export const COLA_BLOCKCHAIN = 'blockchain';

export enum OperacionBlockchain {
  REGISTRAR = 'registrar',
  REVOCAR = 'revocar',
  REEMITIR = 'reemitir',
}

export interface DatosRegistroBlockchain {
  codigoCertificado: string;
  uriMetadatos: string;
  walletDestino: string;
}

export interface DatosRevocacionBlockchain {
  tokenId: string;
  motivo: string;
}

export interface DatosReemisionBlockchain {
  tokenIdAnterior: string;
  codigoCertificadoNuevo: string;
  uriMetadatos: string;
  walletDestino: string;
  motivo: string;
}
