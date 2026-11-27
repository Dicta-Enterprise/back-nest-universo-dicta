import { Injectable } from '@nestjs/common';
import { Certificacion } from 'src/core/entities/certificacion/certificacion.entity';
import { CertificacionService } from 'src/core/services/certificacion/certificacion.service';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetMisCertificacionesUseCase {
  constructor(private readonly service: CertificacionService) {}

  async execute(usuario: UsuarioAutenticado): Promise<Result<Certificacion[]>> {
    try {
      const certificaciones = await this.service.listarMisCertificaciones(usuario);
      return Result.okList(certificaciones);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
