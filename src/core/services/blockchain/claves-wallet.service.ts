import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

const FORMATO_CLAVE_PRIVADA = /^0x[0-9a-fA-F]{64}$/;
// Campo del secreto (JSON) que guarda la clave
const CAMPO_CLAVE_SECRETO = 'privateKey';

// Clave privada de la hot wallet. En producción vive solo en AWS Secrets Manager;
// HOT_WALLET_PRIVATE_KEY es para desarrollo local y, si tiene valor, tiene prioridad
@Injectable()
export class ClavesWalletService {
  private readonly logger = new Logger(ClavesWalletService.name);
  private clavePrivada: string | null = null;

  async obtenerClavePrivada(): Promise<string> {
    if (!this.clavePrivada) {
      const clave = await this.leerClavePrivada();
      this.clavePrivada = this.normalizar(clave);
    }

    return this.clavePrivada;
  }

  private async leerClavePrivada(): Promise<string> {
    if (envs.hotWalletPrivateKey) {
      return envs.hotWalletPrivateKey;
    }

    return this.leerDeAws();
  }

  // Las credenciales de AWS (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) las toma el SDK del entorno
  private async leerDeAws(): Promise<string> {
    let secreto: string | undefined;
    try {
      const cliente = new SecretsManagerClient({ region: envs.awsRegion });
      const respuesta = await cliente.send(
        new GetSecretValueCommand({ SecretId: envs.awsSecretHotWallet }),
      );
      secreto = respuesta.SecretString;
    } catch (error) {
      this.logger.error(
        `No se pudo leer el secreto ${envs.awsSecretHotWallet} de AWS: ${error instanceof Error ? `${error.name}: ${error.message}` : String(error)}`,
      );
      throw new BussinesRuleException(
        'No se pudo leer la clave de la hot wallet desde AWS',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { codigoError: 'CLAVE_WALLET_AWS_NO_DISPONIBLE' },
      );
    }

    const clave = this.extraerClave(secreto);
    if (!clave) {
      throw new BussinesRuleException(
        `El secreto de AWS no tiene el campo "${CAMPO_CLAVE_SECRETO}"`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { codigoError: 'CLAVE_WALLET_NO_CONFIGURADA' },
      );
    }

    this.logger.log('Clave de la hot wallet leída desde AWS Secrets Manager');
    return clave;
  }

  // El secreto es un JSON { "privateKey": "..." }; si es texto plano, es la clave directa
  private extraerClave(secreto: string | undefined): string | null {
    if (!secreto) return null;

    try {
      const datos = JSON.parse(secreto) as Record<string, unknown>;
      const clave = datos[CAMPO_CLAVE_SECRETO];
      return typeof clave === 'string' ? clave : null;
    } catch {
      return secreto;
    }
  }

  private normalizar(clave: string): string {
    const limpia = clave.trim();
    const conPrefijo = limpia.startsWith('0x') ? limpia : `0x${limpia}`;

    if (!FORMATO_CLAVE_PRIVADA.test(conPrefijo)) {
      throw new BussinesRuleException(
        'La clave privada de la hot wallet no tiene un formato válido',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { codigoError: 'CLAVE_WALLET_INVALIDA' },
      );
    }

    return conPrefijo;
  }
}
