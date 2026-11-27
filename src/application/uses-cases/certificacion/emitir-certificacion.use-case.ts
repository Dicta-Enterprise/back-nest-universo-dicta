import { Injectable } from '@nestjs/common';
import { EmitirCertificacionDto } from 'src/application/dto/certificacion';
import { Certificacion } from 'src/core/entities/certificacion/certificacion.entity';
import { CertificacionService } from 'src/core/services/certificacion/certificacion.service';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class EmitirCertificacionUseCase {
  constructor(private readonly service: CertificacionService) {}

  async execute(
    usuario: UsuarioAutenticado,
    dto: EmitirCertificacionDto,
  ): Promise<Result<Certificacion>> {
    try {
      const certificacion = await this.service.emitir(usuario, dto);
      return Result.ok(certificacion);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
