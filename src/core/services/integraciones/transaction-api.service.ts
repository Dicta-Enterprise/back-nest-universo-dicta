import { HttpStatus, Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

interface CursosCompradosResponse {
  data: {
    userId: number;
    totalCursos: number;
    cursos: string[];
  };
}

@Injectable()
export class TransactionApiService {
  private readonly baseUrl = envs.transactionApiUrl;

  async obtenerCursosComprados(idUsuario: number): Promise<string[]> {
    let response: Response;

    try {
      response = await fetch(
        `${this.baseUrl}/api/cursos/${idUsuario}/comprados`,
      );
    } catch {
      throw new BussinesRuleException(
        'No se pudo conectar con el servicio de transacciones',
        HttpStatus.SERVICE_UNAVAILABLE,
        { codigoError: 'TRANSACTION_API_NO_DISPONIBLE' },
      );
    }

    if (!response.ok) {
      throw new BussinesRuleException(
        'Error consultando el servicio de transacciones',
        HttpStatus.BAD_GATEWAY,
        { codigoError: 'TRANSACTION_API_ERROR', status: response.status },
      );
    }

    const body = (await response.json()) as CursosCompradosResponse;
    return body.data.cursos;
  }
}
