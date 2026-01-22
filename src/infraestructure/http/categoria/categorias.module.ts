import { forwardRef, Module } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { SharedModule } from 'src/shared/shared.module';
import { CategoriaPrismaRepository } from 'src/infraestructure/persistence/categoria/categoria.prisma.respository';
import { CATEGORIA_REPOSITORY } from 'src/core/constants/constants';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { CreateCategoriaUseCase } from 'src/application/uses-cases/categoria/create-categoria.use-case';
import { GetAllCategoriaUseCase } from 'src/application/uses-cases/categoria/get-all-categoria.use-case';
import { GetOneCategoriaUseCase } from 'src/application/uses-cases/categoria/get-one-categoria.use-case';
import { UpdateCategoriaUseCase } from 'src/application/uses-cases/categoria/update-categoria.use-case';
import { DeleteCategoriaUseCase } from 'src/application/uses-cases/categoria/delete-categoria.use-case';
import { SaveImageStorageUseCase } from 'src/application/uses-cases/azure/save-image-storage.use.case';
import { AzureStorageService } from 'src/core/services/azure/azure-storage.service';
import { DeleteImageStorageUseCase } from 'src/application/uses-cases/azure/delete-image-storage.use.case';
import { ArchivoService } from 'src/core/services/Archivo/archivo.service';
import { CATEGORIA_FACTORY } from '@constants/factories';
import { DefaultCategoriaFactory } from 'src/core/fabricas/categoria/categoria.factory';
import { GalaxiasModule } from '@controllers/galaxia/galaxias.module';

@Module({
  imports: [
    SharedModule,
    PrismaModule,
    forwardRef(() => GalaxiasModule),
  ],
  controllers: [CategoriaController],
  providers: [
    {
      provide: CATEGORIA_REPOSITORY,
      useClass: CategoriaPrismaRepository,
    },
    {
      provide: CATEGORIA_FACTORY,
      useClass: DefaultCategoriaFactory,
    },
    CategoriaService,
    CreateCategoriaUseCase,
    GetAllCategoriaUseCase,
    GetOneCategoriaUseCase,
    UpdateCategoriaUseCase,
    DeleteCategoriaUseCase,
    SaveImageStorageUseCase,
    DeleteImageStorageUseCase,
    AzureStorageService,
    ArchivoService,
  ],
  exports: [
    CategoriaService,
    CATEGORIA_REPOSITORY,
  ],
})
export class CategoriaModule {}
