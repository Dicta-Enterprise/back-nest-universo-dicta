import { CERTIFICACION_FACTORY } from '@constants/factories';
import { Module } from '@nestjs/common';
import * as useCase from 'src/application/uses-cases/certificacion';
import { CERTIFICACION_REPOSITORY } from 'src/core/constants/constants';
import { DefaultCertificacionFactory } from 'src/core/fabricas/certificacion/certificacion.factory';
import { BlockchainModule } from 'src/core/services/blockchain/blockchain.module';
import { CertificacionService } from 'src/core/services/certificacion/certificacion.service';
import { BunnyStorageService } from 'src/core/services/certificacion/bunny-storage.service';
import { CertificadoPdfService } from 'src/core/services/certificacion/certificado-pdf.service';
import { IntegracionesModule } from 'src/core/services/integraciones/integraciones.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { CertificacionPrismaRepository } from 'src/infraestructure/persistence/certificacion/certificacion.prisma.repository';
import { AuthModule } from 'src/shared/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { PlantillasCertificacionModule } from '../plantilla-certificacion/plantillas-certificacion.module';
import { ProgresoCursoModule } from '../progreso-curso/progreso-curso.module';
import { CertificacionController } from './certificacion.controller';

@Module({
  imports: [
    SharedModule,
    PrismaModule,
    AuthModule,
    IntegracionesModule,
    BlockchainModule,
    PlantillasCertificacionModule,
    ProgresoCursoModule,
  ],
  controllers: [CertificacionController],
  providers: [
    {
      provide: CERTIFICACION_REPOSITORY,
      useClass: CertificacionPrismaRepository,
    },
    {
      provide: CERTIFICACION_FACTORY,
      useClass: DefaultCertificacionFactory,
    },
    CertificacionService,
    CertificadoPdfService,
    BunnyStorageService,
    useCase.EmitirCertificacionUseCase,
    useCase.GetMisCertificacionesUseCase,
    useCase.ValidarCertificacionUseCase,
    useCase.AnularCertificacionUseCase,
    useCase.ReemitirCertificacionUseCase,
    useCase.ReintentarBlockchainCertificacionUseCase,
    useCase.DescargarPdfCertificacionUseCase,
    useCase.ObtenerCertificacionUseCase,
  ],
})
export class CertificacionModule {}
