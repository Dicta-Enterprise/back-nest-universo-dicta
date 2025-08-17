import { Module } from '@nestjs/common';
import {
  CreatePlanetaUseCase,
  DeletePlanetaUseCase,
  GetAllPlanetaUseCase,
  GetOnePlanetaUseCase,
  UpdatePlanetaUseCase,
} from 'src/application/uses-cases/planeta';
import { PLANETA_REPOSITORY } from 'src/core/constants/constants';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { PlanetaPrismaRepository } from 'src/infraestructure/persistence/planeta/planeta.prisma.respository';
import { SharedModule } from 'src/shared/shared.module';
import { planetasController } from './planetas.controller';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [planetasController],
  providers: [
    {
      provide: PLANETA_REPOSITORY,
      useClass: PlanetaPrismaRepository,
    },
    PlanetasService,
    CreatePlanetaUseCase,
    GetAllPlanetaUseCase,
    GetOnePlanetaUseCase,
    UpdatePlanetaUseCase,
    DeletePlanetaUseCase,
  ],
  exports: [PlanetasService],
})
export class PlanetasModule {}
