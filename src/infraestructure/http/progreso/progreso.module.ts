import { Module } from '@nestjs/common';
import { ProgresoController } from './progreso.controller';
import { ProgresoLecturaService } from 'src/core/services/progreso-modulo/progreso-lectura.service';
import { ProgresoModuloPrismaRepository } from 'src/infraestructure/persistence/progreso-modulo/progreso-modulo.prisma.repository';
import { CursoPrismaRepository } from 'src/infraestructure/persistence/curso/curso.prisma.repository';
import { DefaultCursoFactory } from 'src/core/fabricas/curso/curso.factory';
import { CURSO_REPOSITORY, PROGRESO_MODULO_REPOSITORY } from '@constants/constants';
import { CURSO_FACTORY } from '@constants/factories';
import { AuthApiModule } from 'src/core/services/auth-api/auth-api.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthApiModule],
  controllers: [ProgresoController],
  providers: [
    ProgresoLecturaService,
    { provide: PROGRESO_MODULO_REPOSITORY, useClass: ProgresoModuloPrismaRepository },
    { provide: CURSO_REPOSITORY, useClass: CursoPrismaRepository },
    { provide: CURSO_FACTORY, useClass: DefaultCursoFactory },
  ],
})
export class ProgresoModule {}
