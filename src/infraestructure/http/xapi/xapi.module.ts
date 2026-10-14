import { Module } from '@nestjs/common';
import { XapiController } from './xapi.controller';
import { XapiService } from 'src/core/services/xapi/xapi.service';
import { ProgresoModuloService } from 'src/core/services/progreso-modulo/progreso-modulo.service';
import { ProgresoModuloPrismaRepository } from 'src/infraestructure/persistence/progreso-modulo/progreso-modulo.prisma.repository';
import { PROGRESO_MODULO_REPOSITORY } from '@constants/constants';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [XapiController],
  providers: [
    XapiService,
    ProgresoModuloService,
    {
      provide: PROGRESO_MODULO_REPOSITORY,
      useClass: ProgresoModuloPrismaRepository,
    },
  ],
})
export class XapiModule {}
