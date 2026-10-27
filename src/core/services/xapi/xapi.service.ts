import { Injectable, Logger } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { EnviarStatementDto, VerboXapi } from 'src/application/dto/xapi/enviar-statement.dto';

const VERBOS_URI: Record<VerboXapi, string> = {
  initialized: 'http://adlnet.gov/expapi/verbs/initialized',
  progressed: 'http://adlnet.gov/expapi/verbs/progressed',
  passed: 'http://adlnet.gov/expapi/verbs/passed',
  failed: 'http://adlnet.gov/expapi/verbs/failed',
  interacted: 'http://adlnet.gov/expapi/verbs/interacted',
  resumed: 'http://adlnet.gov/expapi/verbs/resumed',
  mastered: 'http://adlnet.gov/expapi/verbs/mastered',
  suspended: 'http://adlnet.gov/expapi/verbs/suspended',
  completed: 'http://adlnet.gov/expapi/verbs/completed',
};

interface UsuarioActual {
  id: number;
  email?: string;
}

export interface ResultadoEnvioLrs {
  ok: boolean;
  motivo?: string;
}

@Injectable()
export class XapiService {
  private readonly logger = new Logger(XapiService.name);

  construirStatement(usuario: UsuarioActual, dto: EnviarStatementDto): object {
    const objetoId = dto.cursoId
      ? `https://mundodictariano.com/curso/${dto.cursoId}/modulo/${dto.moduloId}`
      : `https://mundodictariano.com/modulo/${dto.moduloId}`;

    return {
      actor: {
        name: usuario.email ?? String(usuario.id),
        mbox: usuario.email ? `mailto:${usuario.email}` : undefined,
      },
      verb: {
        id: VERBOS_URI[dto.tipo],
        display: { 'es-CO': dto.tipo },
      },
      object: {
        id: objetoId,
        definition: { name: { 'es-CO': dto.moduloId } },
      },
      result: dto.resultado,
      timestamp: new Date().toISOString(),
    };
  }

  async enviarAlLRS(statement: object): Promise<ResultadoEnvioLrs> {
    if (!envs.lrsEndpoint || !envs.lrsKey || !envs.lrsSecret) {
      this.logger.warn('LRS no configurado (LRS_ENDPOINT/LRS_KEY/LRS_SECRET vacíos) — statement no enviado.');
      return { ok: false, motivo: 'El LRS todavía no está configurado (faltan las credenciales de SCORM Cloud).' };
    }

    const auth = Buffer.from(`${envs.lrsKey}:${envs.lrsSecret}`).toString('base64');

    try {
      const response = await fetch(envs.lrsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
          'X-Experience-API-Version': '1.0.3',
        },
        body: JSON.stringify(statement),
      });

      if (!response.ok) {
        this.logger.error(`LRS respondió con estado ${response.status}`);
        return { ok: false, motivo: `El LRS respondió con estado ${response.status}.` };
      }

      return { ok: true };
    } catch (error) {
      this.logger.error('No se pudo conectar con el LRS.', error as Error);
      return { ok: false, motivo: 'No se pudo conectar con el LRS.' };
    }
  }
}
