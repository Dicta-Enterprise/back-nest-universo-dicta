import { Module } from '@nestjs/common';
import { GalaxiasService } from '../../../core/services/galaxia/galaxias.service';
import { GalaxiasController } from './galaxias.controller';
import {
  CATEGORIA_REPOSITORY,
  GALAXIA_REPOSITORY,
} from 'src/core/constants/constants';
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
import { CategoriaPrismaRepository } from 'src/infraestructure/persistence/categoria/categoria.prisma.respository';
import { SaveImageStorageUseCase } from 'src/application/uses-cases/azure';
import { AzureStorageService } from 'src/core/services/azure/azure-storage.service';
import { ArchivoService } from 'src/core/services/Archivo/archivo.service';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [GalaxiasController],
  providers: [
    {
      provide: GALAXIA_REPOSITORY,
      useClass: GalaxiaPrismaRepository,
    },
    {
      provide: CATEGORIA_REPOSITORY,
      useClass: CategoriaPrismaRepository,
    },
    GalaxiasService,
    CategoriaService,
    GetAllGalaxiaUseCase,
    CreateGalaxiaUseCase,
    CreateMultipleGalaxiasUseCase,
    GetOneGalaxiaUseCase,
    ActualizarGalaxiaCasoDeUso,
    DeleteGalaxiaUseCase,
    SaveImageStorageUseCase,
    AzureStorageService,
    ArchivoService
  ],
  exports: [GalaxiasService],
})
export class GalaxiasModule {}
