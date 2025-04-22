import { Module } from '@nestjs/common';
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

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [CategoriaController],
  providers: [
    {
      provide: CATEGORIA_REPOSITORY,
      useClass: CategoriaPrismaRepository,
    },
    CategoriaService,
    CreateCategoriaUseCase,
    GetAllCategoriaUseCase,
    GetOneCategoriaUseCase,
    UpdateCategoriaUseCase,
    DeleteCategoriaUseCase,
  ],
  exports: [CategoriaService],
})
export class CategoriaModule {}
