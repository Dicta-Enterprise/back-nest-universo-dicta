import { Module } from '@nestjs/common';
import { GetAllParametersUseCase } from '../../../application/uses-cases/parametros/get-all-parameters.use-case';
import { ParametersController } from './parameters.controller';

import { CategoriaModule } from '../categoria/categorias.module';
import { GalaxiasModule } from '../galaxia/galaxias.module';
import { PlanetasModule } from '../planeta/planetas.module';

@Module({
  imports: [CategoriaModule, GalaxiasModule, PlanetasModule],
  controllers: [ParametersController],
  providers: [GetAllParametersUseCase],
})
export class ParametersModule {}
