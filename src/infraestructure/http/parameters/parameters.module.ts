import { Module } from '@nestjs/common';
import { ParametersController } from './parameters.controller';
import { GetParametersUseCase } from 'src/application/uses-cases/parameters/get-all-parameters.use-case';
import { GetParametersWithPaginationUseCase } from 'src/application/uses-cases/parameters/get-all-parameters-paginacion.use-case';
import { ParametersService } from '../../../core/services/parameters/parameters.service';
import { CategoriaModule } from '../categoria/categorias.module';
import { GalaxiasModule } from '../galaxia/galaxias.module';
import { PlanetasModule } from '../planeta/planetas.module';
import { IdiomaModule } from '../idioma/idioma.module';
import { ProfesorModule } from '../profesor/profesor.module';

@Module({
  imports: [
    CategoriaModule,
    GalaxiasModule,
    PlanetasModule,
    IdiomaModule,
    ProfesorModule,
  ],
  controllers: [ParametersController],
  providers: [
    ParametersService,
    GetParametersUseCase,
    GetParametersWithPaginationUseCase,
  ],
  exports: [
    ParametersService,
  ],
})
export class ParametersModule {}