import { Module } from '@nestjs/common';
import { GalaxiasService } from '../../../core/services/galaxia/galaxias.service';
import { GalaxiasController } from './galaxias.controller';
import { GALAXIA_REPOSITORY } from 'src/core/constants/constants';
import { GalaxiaPrismaRepository } from 'src/infraestructure/persistence/galaxia/galaxia.prisma.repository';
import { GetAllGalaxiaUseCase } from 'src/application/uses-cases/galaxias/get-all-galaxia.use.case';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { CreateGalaxiaUseCase } from 'src/application/uses-cases/galaxias';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [GalaxiasController],
  providers: [
    {
      provide: GALAXIA_REPOSITORY,
      useClass: GalaxiaPrismaRepository,
    },
    GalaxiasService,
    GetAllGalaxiaUseCase,
    CreateGalaxiaUseCase
  ],
  exports: [GalaxiasService],
})
export class GalaxiasModule {}
