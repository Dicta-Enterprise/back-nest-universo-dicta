import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './cursos/cursos.module';
import { GalaxiasModule } from './galaxias/galaxias.module';
import { MenuModule } from './menu/menu.module';
import { PlanetasModule } from './planetas/planetas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { IdiomasModule } from './idiomas/idiomas.module';

@Module({
  imports: [CursosModule, GalaxiasModule, MenuModule, PlanetasModule, CategoriasModule, LandingPageModule, IdiomasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
