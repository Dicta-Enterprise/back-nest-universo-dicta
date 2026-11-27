import { Injectable } from '@nestjs/common';
import { Certificacion } from 'src/core/entities/certificacion/certificacion.entity';
import { CertificacionService } from 'src/core/services/certificacion/certificacion.service';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ObtenerCertificacionUseCase {
  constructor(private readonly service: CertificacionService) {}

  async execute(
    usuario: UsuarioAutenticado,
    id: string,
  ): Promise<Result<Certificacion>> {
    try {
      const certificacion = await this.service.obtener(usuario, id);
      return Result.ok(certificacion);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
