import { PROGRESO_CURSO_FACTORY } from '@constants/factories';
import { Module } from '@nestjs/common';
import * as useCase from 'src/application/uses-cases/progreso-curso';
import { PROGRESO_CURSO_REPOSITORY } from 'src/core/constants/constants';
import { DefaultProgresoCursoFactory } from 'src/core/fabricas/progreso-curso/progreso-curso.factory';
import { IntegracionesModule } from 'src/core/services/integraciones/integraciones.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { ProgresoCursoService } from 'src/core/services/progreso-curso/progreso-curso.service';
import { ProgresoCursoPrismaRepository } from 'src/infraestructure/persistence/progreso-curso/progreso-curso.prisma.repository';
import { AuthModule } from 'src/shared/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { ProgresoCursoController } from './progreso-curso.controller';

@Module({
  imports: [SharedModule, PrismaModule, AuthModule, IntegracionesModule],
  controllers: [ProgresoCursoController],
  providers: [
    {
      provide: PROGRESO_CURSO_REPOSITORY,
      useClass: ProgresoCursoPrismaRepository,
    },
    {
      provide: PROGRESO_CURSO_FACTORY,
      useClass: DefaultProgresoCursoFactory,
    },
    ProgresoCursoService,
    useCase.RegistrarProgresoCursoUseCase,
    useCase.GetMisProgresosCursoUseCase,
    useCase.GetMiProgresoCursoUseCase,
  ],
  exports: [ProgresoCursoService],
})
export class ProgresoCursoModule {}
