import { CERTIFICACION_FACTORY } from '@constants/factories';
import { Inject, Injectable } from '@nestjs/common';
import {
  EstadoCertificacion,
  Prisma,
  TipoCertificacion,
} from '@prisma/client';
import { Certificacion } from 'src/core/entities/certificacion/certificacion.entity';
import { CertificacionFactory } from 'src/core/fabricas/certificacion/certificacion.factory';
import {
  CertificacionRepository,
  DatosAnulacionCertificacion,
  DatosBlockchainCertificacion,
  DatosNuevaCertificacion,
} from 'src/core/repositories/certificacion/certificacion.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { ValidationError } from 'src/shared/domain/errors/validation.error';

// Solo sirve para cortar la transacción de reemitir
class CertificadoYaAnuladoError extends Error {}

@Injectable()
export class CertificacionPrismaRepository implements CertificacionRepository {
  constructor(
    private prisma: PrismaService,
    @Inject(CERTIFICACION_FACTORY)
    private readonly factory: CertificacionFactory,
  ) {}

  async crear(datos: DatosNuevaCertificacion): Promise<Certificacion> {
    try {
      const data = await this.prisma.certificacion.create({
        data: this.datosCreacion(datos),
      });
      return this.factory.crearDesdePrisma(data);
    } catch {
      throw new ValidationError('Error al guardar el certificado');
    }
  }

  async findById(id: string): Promise<Certificacion | null> {
    const data = await this.prisma.certificacion.findUnique({ where: { id } });
    return data ? this.factory.crearDesdePrisma(data) : null;
  }

  async findByCodigo(codigoCertificado: string): Promise<Certificacion | null> {
    const data = await this.prisma.certificacion.findUnique({
      where: { codigoCertificado },
    });
    return data ? this.factory.crearDesdePrisma(data) : null;
  }

  async findReemplazadoPor(idNuevo: string): Promise<Certificacion | null> {
    const data = await this.prisma.certificacion.findFirst({
      where: { idCertificadoReemplazo: idNuevo },
    });
    return data ? this.factory.crearDesdePrisma(data) : null;
  }

  async findEmitidaByTitularYCurso(
    idUsuario: number,
    idCuentaAsociada: number | null,
    idCurso: string,
    tipoCertificacion: TipoCertificacion,
  ): Promise<Certificacion | null> {
    const data = await this.prisma.certificacion.findFirst({
      where: {
        idUsuario,
        idCuentaAsociada,
        idCurso,
        tipoCertificacion,
        estado: EstadoCertificacion.EMITIDA,
      },
    });
    return data ? this.factory.crearDesdePrisma(data) : null;
  }

  async findAllByUsuario(idUsuario: number): Promise<Certificacion[]> {
    const data = await this.prisma.certificacion.findMany({
      where: { idUsuario },
      orderBy: { fechaEmision: 'desc' },
    });
    return data.map((c) => this.factory.crearDesdePrisma(c));
  }

  async findAllByCuentaAsociada(
    idCuentaAsociada: number,
  ): Promise<Certificacion[]> {
    const data = await this.prisma.certificacion.findMany({
      where: { idCuentaAsociada },
      orderBy: { fechaEmision: 'desc' },
    });
    return data.map((c) => this.factory.crearDesdePrisma(c));
  }

  async anular(
    id: string,
    datos: DatosAnulacionCertificacion,
  ): Promise<Certificacion | null> {
    const { count } = await this.prisma.certificacion.updateMany({
      where: { id, estado: EstadoCertificacion.EMITIDA },
      data: { ...datos, estado: EstadoCertificacion.ANULADA },
    });
    return count === 0 ? null : this.findById(id);
  }

  async reemitir(
    idAnterior: string,
    anulacion: DatosAnulacionCertificacion,
    nueva: DatosNuevaCertificacion,
  ): Promise<Certificacion | null> {
    try {
      const data = await this.prisma.$transaction(async (tx) => {
        const creada = await tx.certificacion.create({
          data: this.datosCreacion(nueva),
        });
        const { count } = await tx.certificacion.updateMany({
          where: { id: idAnterior, estado: EstadoCertificacion.EMITIDA },
          data: {
            ...anulacion,
            estado: EstadoCertificacion.ANULADA,
            idCertificadoReemplazo: creada.id,
          },
        });
        // Lanzar deshace la transacción, así no queda el nuevo suelto
        if (count === 0) throw new CertificadoYaAnuladoError();
        return creada;
      });
      return this.factory.crearDesdePrisma(data);
    } catch (error) {
      if (error instanceof CertificadoYaAnuladoError) return null;
      throw new ValidationError('Error al reemitir el certificado');
    }
  }

  async actualizarBlockchain(
    id: string,
    datos: DatosBlockchainCertificacion,
  ): Promise<Certificacion> {
    const data = await this.prisma.certificacion.update({
      where: { id },
      data: datos,
    });
    return this.factory.crearDesdePrisma(data);
  }

  async guardarUrlCertificado(id: string, urlCertificado: string): Promise<void> {
    await this.prisma.certificacion.update({
      where: { id },
      data: { urlCertificado },
    });
  }

  private datosCreacion(
    datos: DatosNuevaCertificacion,
  ): Prisma.CertificacionUncheckedCreateInput {
    return {
      ...datos,
      configuracionSnapshot: datos.configuracionSnapshot as Prisma.InputJsonValue | null,
    };
  }
}
