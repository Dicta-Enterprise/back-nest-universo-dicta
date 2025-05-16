import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './infraestructure/http/curso/cursos.module';
import { GalaxiasModule } from './infraestructure/http/galaxia/galaxias.module';
import { CategoriaModule } from './infraestructure/http/categoria/categorias.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MenuModule } from './infraestructure/http/menu/menu.module';
import { AzureModule } from './infraestructure/http/azure/azure.module';
import { PlanetaModule } from './infraestructure/http/planeta/planetas.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CursosModule,
    GalaxiasModule,
    MenuModule,
    PlanetaModule,
    CategoriaModule,
    AzureModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
