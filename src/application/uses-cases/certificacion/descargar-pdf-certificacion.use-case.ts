import { Injectable } from '@nestjs/common';
import { CertificacionService } from 'src/core/services/certificacion/certificacion.service';
import { UsuarioAutenticado } from 'src/shared/auth/usuario-autenticado.interface';
import { Result } from 'src/shared/domain/result/result';

export interface PdfCertificacion {
  nombreArchivo: string;
  contenido: Buffer;
}

@Injectable()
export class DescargarPdfCertificacionUseCase {
  constructor(private readonly service: CertificacionService) {}

  async execute(
    usuario: UsuarioAutenticado,
    id: string,
  ): Promise<Result<PdfCertificacion>> {
    try {
      const pdf = await this.service.generarPdf(usuario, id);
      return Result.ok(pdf);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
