import { Module } from '@nestjs/common';
import { GetAllParametersUseCase } from '../../../application/uses-cases/parametros/get-all-parameters.use-case';
import { ParametersController } from './parameters.controller';
import { ParametrosService } from '../../../core/services/parametros/parametros.service';
import { PrismaModule } from '../../../core/services/prisma/prisma.module';
import { ParametrosPrismaRepository } from '../../../infraestructure/persistence/parametros/parametros.prisma.repository';
import { IParametrosRepository } from '../../../core/repositories/parametros/parametros.repository';

/**
 * Módulo de Parámetros
 *
 * Proporciona un endpoint unificado para obtener todos los parámetros del sistema.
 * Usa arquitectura dinámica basada en configuración externa.
 *
 * ARQUITECTURA COMPLETA:
 * Controller → UseCase → Service → Repository → Prisma
 *
 * Dependencias:
 * - PrismaModule: Para acceso a base de datos
 * - ParametrosPrismaRepository: Implementación del Repository Pattern
 * - ParametrosService: Lógica de negocio y orquestación
 * - GetAllParametersUseCase: Caso de uso que coordina la operación
 */
@Module({
  imports: [PrismaModule],
  controllers: [ParametersController],
  providers: [
    GetAllParametersUseCase,
    ParametrosService,
    {
      provide: IParametrosRepository,
      useClass: ParametrosPrismaRepository,
    },
  ],
})
export class ParametersModule {}
