import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TipoCertificacion } from '@prisma/client';
import { envs } from 'src/config/envs';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

const PINATA_PIN_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

// IPFS es público y permanente: el nombre solo se sube si el titular es adulto
const TIPOS_CON_NOMBRE_PUBLICO: TipoCertificacion[] = [
  TipoCertificacion.RECONOCIMIENTO,
];

export interface DatosMetadatosCertificado {
  codigoCertificado: string;
  tipoCertificacion: TipoCertificacion;
  nombreCurso: string;
  nombreTitular: string;
  fechaEmision: Date;
  urlVerificacion: string;
}

export interface MetadatosSubidos {
  cid: string;
  uri: string;
  urlGateway: string;
}

interface PinJsonResponse {
  IpfsHash: string;
}

@Injectable()
export class PinataService {
  private readonly logger = new Logger(PinataService.name);

  async subirMetadatos(
    datos: DatosMetadatosCertificado,
  ): Promise<MetadatosSubidos> {
    const jwt = this.obtenerJwt();
    let response: Response;

    try {
      response = await fetch(PINATA_PIN_JSON_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pinataContent: this.armarMetadatos(datos),
          pinataMetadata: {
            name: `certificado-${datos.codigoCertificado}.json`,
          },
        }),
      });
    } catch {
      throw new BussinesRuleException(
        'No se pudo conectar con Pinata',
        HttpStatus.SERVICE_UNAVAILABLE,
        { codigoError: 'PINATA_NO_DISPONIBLE' },
      );
    }

    if (!response.ok) {
      this.logger.error(
        `Pinata respondió ${response.status}: ${await response.text()}`,
      );
      throw new BussinesRuleException(
        'Error subiendo los metadatos del certificado a IPFS',
        HttpStatus.BAD_GATEWAY,
        { codigoError: 'PINATA_ERROR', status: response.status },
      );
    }

    const { IpfsHash: cid } = (await response.json()) as PinJsonResponse;

    return {
      cid,
      uri: `ipfs://${cid}`,
      urlGateway: `https://${envs.pinataGateway}/ipfs/${cid}`,
    };
  }

  private armarMetadatos(datos: DatosMetadatosCertificado) {
    const atributos = [
      { trait_type: 'Código', value: datos.codigoCertificado },
      { trait_type: 'Curso', value: datos.nombreCurso },
      { trait_type: 'Tipo', value: datos.tipoCertificacion },
      {
        trait_type: 'Fecha de emisión',
        value: datos.fechaEmision.toISOString().slice(0, 10),
      },
    ];

    if (TIPOS_CON_NOMBRE_PUBLICO.includes(datos.tipoCertificacion)) {
      atributos.push({ trait_type: 'Titular', value: datos.nombreTitular });
    }

    return {
      name: `Certificado Mundo Dictariano ${datos.codigoCertificado}`,
      description:
        'Certificado de Mundo Dictariano registrado en la blockchain Polygon.',
      external_url: datos.urlVerificacion,
      attributes: atributos,
    };
  }

  private obtenerJwt(): string {
    if (!envs.pinataJwt) {
      throw new BussinesRuleException(
        'No hay un JWT de Pinata configurado',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { codigoError: 'PINATA_NO_CONFIGURADO' },
      );
    }

    return envs.pinataJwt;
  }
}
