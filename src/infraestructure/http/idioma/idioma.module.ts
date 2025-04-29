import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
import { IdiomaController } from './idioma.controller';
import { IDIOMA_REPOSITORY } from 'src/core/constants/constants';
import { IdiomaPrismaRepository } from 'src/infraestructure/persistence/idioma/idoma.prisma.repository';
import { IdiomaService } from 'src/core/services/idioma/idioma.service';
import { CreateIdiomaUseCase } from 'src/application/uses-cases/idioma/create-idioma.use-case';
import { DeleteIdiomaUseCase } from 'src/application/uses-cases/idioma'; 
import { GetAllIdiomaUseCase } from 'src/application/uses-cases/idioma/get-all-idioma.use-case';
import { ActualizarIdiomaCasoDeUso } from 'src/application/uses-cases/idioma';
import { GetOneIdiomaUseCase } from 'src/application/uses-cases/idioma';
import { ValidatorService } from 'src/shared/application/validation/validator.service';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [IdiomaController],
  providers: [
    {
      provide: IDIOMA_REPOSITORY,
      useClass: IdiomaPrismaRepository,
    },
    IdiomaService,
    CreateIdiomaUseCase,
    DeleteIdiomaUseCase,
    GetAllIdiomaUseCase,
    GetOneIdiomaUseCase,
    ActualizarIdiomaCasoDeUso,
    ValidatorService,
  ],
  exports: [IdiomaService],
})
export class IdiomaModule {}
