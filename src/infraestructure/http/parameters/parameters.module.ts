import { Module } from '@nestjs/common';
import { ParametersController } from './parameters.controller';
import { ParametersService } from '../../../core/services/parameters/parameters.service';
import { CategoriaModule } from '../categoria/categorias.module';
import { GalaxiasModule } from '../galaxia/galaxias.module';
import { PlanetasModule } from '../planeta/planetas.module';
import { IdiomaModule } from '../idioma/idioma.module';
import { ProfesorModule } from '../profesor/profesor.module';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [
    CategoriaModule,
    GalaxiasModule,
    PlanetasModule,
    IdiomaModule,
    ProfesorModule,
    MenuModule,
  ],
  controllers: [ParametersController],
  providers: [
    ParametersService,
    {
      provide: 'MenuService',
      useFactory: () => {
        return {
          findAll: async () => []
        };
      },
    },
  ],
})
export class ParametersModule {}