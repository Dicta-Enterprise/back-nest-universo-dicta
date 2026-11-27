import { Injectable } from '@nestjs/common';
import {
  AnularCertificacionDto,
  ReemitirCertificacionDto,
} from 'src/application/dto/certificacion';
import { Certificacion } from 'src/core/entities/certificacion/certificacion.entity';
import { CertificacionService } from 'src/core/services/certificacion/certificacion.service';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class AnularCertificacionUseCase {
  constructor(private readonly service: CertificacionService) {}

  async execute(
    admin: UsuarioAutenticado,
    codigo: string,
    dto: AnularCertificacionDto,
  ): Promise<Result<Certificacion>> {
    try {
      const certificacion = await this.service.anular(admin, codigo, dto);
      return Result.ok(certificacion);
    } catch (error) {
      return Result.fail(error);
    }
  }
}

@Injectable()
export class ReemitirCertificacionUseCase {
  constructor(private readonly service: CertificacionService) {}

  async execute(
    admin: UsuarioAutenticado,
    codigo: string,
    dto: ReemitirCertificacionDto,
  ): Promise<Result<Certificacion>> {
    try {
      const certificacion = await this.service.reemitir(admin, codigo, dto);
      return Result.ok(certificacion);
    } catch (error) {
      return Result.fail(error);
    }
  }
}

@Injectable()
export class ReintentarBlockchainCertificacionUseCase {
  constructor(private readonly service: CertificacionService) {}

  async execute(
    usuario: UsuarioAutenticado,
    codigo: string,
  ): Promise<Result<Certificacion>> {
    try {
      const certificacion = await this.service.reintentarBlockchain(
        usuario,
        codigo,
      );
      return Result.ok(certificacion);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
