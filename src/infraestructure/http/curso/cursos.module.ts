import { Module } from '@nestjs/common';
import { CursosService } from '../../../core/services/curso/cursos.service';
import { CursosController } from './cursos.controller';
import { CURSO_REPOSITORY } from 'src/core/constants/constants';
import { CursoPrismaRepository } from 'src/infraestructure/persistence/curso/curso.prisma.repository';
import * as useCase from 'src/application/uses-cases/curso';
import * as azureCase from 'src/application/uses-cases/azure';
import { AzureStorageService } from 'src/core/services/azure/azure-storage.service';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';

@Module({
  imports:[SharedModule, PrismaModule],
  controllers: [CursosController],
  providers: [
    {
      provide: CURSO_REPOSITORY,
      useClass: CursoPrismaRepository,
  },
  CursosService,
  useCase.CreateCursoUseCase,
  useCase.DeleteCursoUseCase,
  useCase.GetAllCursoUseCase,
  useCase.GetOneCursoUseCase,
  useCase.UpdateCursoUseCase,
  azureCase.SaveImageStorageUseCase,
  azureCase.DeleteImageStorageUseCase,
  AzureStorageService
],
})
export class CursosModule {}
