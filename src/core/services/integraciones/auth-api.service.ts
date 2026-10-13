import { HttpStatus, Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

export interface PermisosCuentaAsociada {
  puedeVerCursos: boolean;
  puedeComprarCursos: boolean;
  puedeVerProgreso: boolean;
  puedeUsarChat: boolean;
  puedeDescargarMaterial: boolean;
  puedeVerCertificados: boolean;
}

export interface CuentaAsociadaAuth {
  id: number;
  idpadre: number;
  tipocuenta: 'NINO' | 'JOVEN';
  estado: 'PENDIENTE' | 'ACTIVA' | 'INACTIVA';
  permisos: PermisosCuentaAsociada | null;
}

export interface MiCuentaAuth {
  idusuario: number;
  nombre: string;
  cuentaAsociada: CuentaAsociadaAuth | null;
}

export interface CursoAsignadoAuth {
  id: number;
  idcuentaasociada: number;
  idcurso: string;
  estado: 'ACTIVO' | 'COMPLETADO' | 'CANCELADO';
}

@Injectable()
export class AuthApiService {
  private readonly baseUrl = envs.authApiUrl;

  async obtenerMiCuenta(accessToken: string): Promise<MiCuentaAuth> {
    const body = await this.get<{ data: MiCuentaAuth }>(
      '/api/cuentas-asociadas/mi-cuenta',
      accessToken,
    );
    return body.data;
  }

  async obtenerCursosAsignados(
    idCuentaAsociada: number,
    accessToken: string,
  ): Promise<CursoAsignadoAuth[]> {
    const body = await this.get<{ data: CursoAsignadoAuth[] }>(
      `/api/cuentas-asociadas/${idCuentaAsociada}/cursos`,
      accessToken,
    );
    return body.data;
  }

  private async get<T>(path: string, accessToken: string): Promise<T> {
    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        headers: { Cookie: `accessToken=${accessToken}` },
      });
    } catch {
      throw new BussinesRuleException(
        'No se pudo conectar con el servicio de autenticación',
        HttpStatus.SERVICE_UNAVAILABLE,
        { codigoError: 'AUTH_API_NO_DISPONIBLE' },
      );
    }

    if (response.status === HttpStatus.UNAUTHORIZED) {
      throw new BussinesRuleException(
        'La sesión no es válida o ha expirado',
        HttpStatus.UNAUTHORIZED,
        { codigoError: 'SESION_INVALIDA' },
      );
    }

    if (!response.ok) {
      throw new BussinesRuleException(
        'Error consultando el servicio de autenticación',
        HttpStatus.BAD_GATEWAY,
        { codigoError: 'AUTH_API_ERROR', status: response.status },
      );
    }

    return (await response.json()) as T;
  }
}
