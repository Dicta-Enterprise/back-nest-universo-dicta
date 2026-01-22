import { Module } from '@nestjs/common';
import { GalaxiasService } from '../../../core/services/galaxia/galaxias.service';
import { GalaxiasController } from './galaxias.controller';
import { GALAXIA_REPOSITORY } from 'src/core/constants/constants';
import { GalaxiaPrismaRepository } from 'src/infraestructure/persistence/galaxia/galaxia.prisma.repository';
import { GetAllGalaxiaUseCase } from 'src/application/uses-cases/galaxias/get-all-galaxia.use.case';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import {
  ActualizarGalaxiaCasoDeUso,
  CreateGalaxiaUseCase,
  CreateMultipleGalaxiasUseCase,
  DeleteGalaxiaUseCase,
  GetOneGalaxiaUseCase,
} from 'src/application/uses-cases/galaxias';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { SaveImageStorageUseCase } from 'src/application/uses-cases/azure';
import { AzureStorageService } from 'src/core/services/azure/azure-storage.service';
import { ArchivoService } from 'src/core/services/Archivo/archivo.service';
import { GALAXIA_FACTORY } from '@constants/factories';
import { DefaultGalaxiaFactory } from 'src/core/fabricas/galaxia/galaxia.factory';
import { CategoriaModule } from '@controllers/categoria/categorias.module';

@Module({
  imports: [SharedModule, PrismaModule, CategoriaModule],
  controllers: [GalaxiasController],
  providers: [
    {
      provide: GALAXIA_REPOSITORY,
      useClass: GalaxiaPrismaRepository,
    },
    {
      provide: GALAXIA_FACTORY,
      useClass: DefaultGalaxiaFactory,
    },
    GalaxiasService,
    GetAllGalaxiaUseCase,
    CategoriaService,
    CreateGalaxiaUseCase,
    CreateMultipleGalaxiasUseCase,
    GetOneGalaxiaUseCase,
    ActualizarGalaxiaCasoDeUso,
    DeleteGalaxiaUseCase,
    SaveImageStorageUseCase,
    AzureStorageService,
    ArchivoService,
  ],
  exports: [GalaxiasService, CategoriaService],
})
export class GalaxiasModule {}
