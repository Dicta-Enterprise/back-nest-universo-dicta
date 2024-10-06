import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './cursos/cursos.module';
import { GalaxiasModule } from './galaxias/galaxias.module';
import { MenuModule } from './menu/menu.module';
import { PlanetasModule } from './planetas/planetas.module';

@Module({
  imports: [CursosModule, GalaxiasModule, MenuModule, PlanetasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
