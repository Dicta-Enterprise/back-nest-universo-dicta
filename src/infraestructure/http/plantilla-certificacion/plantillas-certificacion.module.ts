import { Module } from '@nestjs/common';
import { PLANTILLA_CERTIFICACION_REPOSITORY } from 'src/core/constants/constants';
import { PLANTILLA_CERTIFICACION_FACTORY } from '@constants/factories';
import { DefaultPlantillaCertificacionFactory } from 'src/core/fabricas/plantilla-certificacion/plantilla-certificacion.factory';
import { PlantillasCertificacionService } from 'src/core/services/plantilla-certificacion/plantillas-certificacion.service';
import { PlantillaCertificacionPrismaRepository } from 'src/infraestructure/persistence/plantilla-certificacion/plantilla-certificacion.prisma.repository';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
import * as useCase from 'src/application/uses-cases/plantilla-certificacion';
import { PlantillasCertificacionController } from './plantillas-certificacion.controller';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [PlantillasCertificacionController],
  providers: [
    {
      provide: PLANTILLA_CERTIFICACION_REPOSITORY,
      useClass: PlantillaCertificacionPrismaRepository,
    },
    {
      provide: PLANTILLA_CERTIFICACION_FACTORY,
      useClass: DefaultPlantillaCertificacionFactory,
    },
    PlantillasCertificacionService,
    useCase.CreatePlantillaCertificacionUseCase,
    useCase.GetAllPlantillasCertificacionUseCase,
    useCase.GetOnePlantillaCertificacionUseCase,
    useCase.UpdatePlantillaCertificacionUseCase,
    useCase.ActivarPlantillaCertificacionUseCase,
    useCase.DesactivarPlantillaCertificacionUseCase,
    useCase.DeletePlantillaCertificacionUseCase,
  ],
})
export class PlantillasCertificacionModule {}
