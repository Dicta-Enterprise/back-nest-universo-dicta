import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
import { planetaController } from './planetas.controller';
import { PLANETA_REPOSITORY } from 'src/core/constants/constants';
import { CreatePlanetaUseCase, DeletePlanetaUseCase, GetAllPlanetaUseCase, GetOnePlanetaUseCase, UpdatePlanetaUseCase } from 'src/application/uses-cases/planeta';
import { PlanetaPrismaRepository } from 'src/infraestructure/persistence/planeta/planeta.prisma.respository';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';


@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [planetaController],
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
export class PlanetaModule {}