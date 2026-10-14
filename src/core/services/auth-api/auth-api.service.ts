import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { envs } from 'src/config/envs';

export interface MiembroFamiliaAuth {
  idcuenta: number;
  idusuario: number;
  alias: string | null;
  tipocuenta: string;
  estado: string;
}

export interface FamiliaAuth {
  id: number;
  nombre: string | null;
  padre: { id: number; username: string; email: string };
  miembros: MiembroFamiliaAuth[];
}

const TIMEOUT_MS = 5000;

// Cliente de los endpoints /internal de back-auth (quién es de qué familia, nombres, tipo de cuenta).
@Injectable()
export class AuthApiService {
  private readonly logger = new Logger(AuthApiService.name);

  async listarFamilias(): Promise<FamiliaAuth[]> {
    const response = await this.llamar('/api/internal/familias');
    return (await response.json()) as FamiliaAuth[];
  }

  // Devuelve null si ese usuario todavía no tiene familia.
  async obtenerFamiliaPorPadre(idpadre: number): Promise<FamiliaAuth | null> {
    const response = await this.llamar(`/api/internal/familias/padre/${idpadre}`, [404]);
    if (response.status === 404) {
      return null;
    }
    return (await response.json()) as FamiliaAuth;
  }

  private async llamar(ruta: string, estadosAceptados: number[] = []): Promise<Response> {
    let response: Response;
    try {
      response = await fetch(`${envs.authApiUrl}${ruta}`, {
        headers: { 'x-internal-api-key': envs.internalApiKey },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      this.logger.error(`No se pudo conectar con back-auth (${ruta}).`, error as Error);
      throw new ServiceUnavailableException('No se pudo conectar con el servicio de autenticación.');
    }

    if (!response.ok && !estadosAceptados.includes(response.status)) {
      this.logger.error(`back-auth respondió ${response.status} en ${ruta}.`);
      throw new BadGatewayException('El servicio de autenticación respondió con un error.');
    }

    return response;
  }
}
