import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './infraestructure/http/curso/cursos.module';
import {IdiomaModule} from './infraestructure/http/idioma/idioma.module';
import { GalaxiasModule } from './infraestructure/http/galaxia/galaxias.module';
import { PlanetasModule } from './infraestructure/http/planeta/planetas.module';
import { CategoriaModule } from './infraestructure/http/categoria/categorias.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MenuModule } from './infraestructure/http/menu/menu.module';
import { AzureModule } from './infraestructure/http/azure/azure.module';
import { ProfesorModule } from './infraestructure/http/profesor/profesor.module';
import { ParametersModule } from './infraestructure/http/parametros/parameters.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CursosModule,
    GalaxiasModule,
    MenuModule,
    PlanetasModule,
    CategoriaModule,
    IdiomaModule,
    ProfesorModule,
    AzureModule,
    ParametersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
