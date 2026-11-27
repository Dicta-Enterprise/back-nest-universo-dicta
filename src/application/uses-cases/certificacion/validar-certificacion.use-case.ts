import { Injectable } from '@nestjs/common';
import {
  CertificacionService,
  ValidacionCertificado,
} from 'src/core/services/certificacion/certificacion.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ValidarCertificacionUseCase {
  constructor(private readonly service: CertificacionService) {}

  async execute(codigo: string): Promise<Result<ValidacionCertificado>> {
    try {
      const validacion = await this.service.validar(codigo);
      return Result.ok(validacion);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
