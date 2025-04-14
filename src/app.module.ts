import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './cursos/cursos.module';
import { GalaxiasModule } from './galaxias/galaxias.module';
import { MenuModule } from './menu/menu.module';
import { PlanetasModule } from './planetas/planetas.module';
import { CategoriaModule } from './infraestructure/http/categoria/categorias.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CursosModule,
    GalaxiasModule,
    MenuModule,
    PlanetasModule,
    CategoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
