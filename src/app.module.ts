import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './infraestructure/http/curso/cursos.module';
import { IdiomaModule } from './infraestructure/http/idioma/idioma.module';
import { GalaxiasModule } from './infraestructure/http/galaxia/galaxias.module';
import { PlanetasModule } from './infraestructure/http/planeta/planetas.module';
import { CategoriaModule } from './infraestructure/http/categoria/categorias.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MenuModule } from './infraestructure/Menu/menu.module';
import { AzureModule } from './infraestructure/http/azure/azure.module';
import { ProfesorModule } from './infraestructure/http/profesor/profesor.module';
import { ParametersModule } from './infraestructure/http/parameters/parameters.module';
import { LandingPageModule } from './infraestructure/http/landing-page/landing-page.module';
import { BunnyModule } from './infraestructure/http/bunny/bunny.module';
import { XapiModule } from './infraestructure/http/xapi/xapi.module';
import { ProgresoModule } from './infraestructure/http/progreso/progreso.module';
import { AdminModule } from './infraestructure/http/admin/admin.module';
import { PlantillasCertificacionModule } from './infraestructure/http/plantilla-certificacion/plantillas-certificacion.module';
import { ProgresoCursoModule } from './infraestructure/http/progreso-curso/progreso-curso.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CursosModule,
    PlanetasModule,
    GalaxiasModule,
    CategoriaModule,
    IdiomaModule,
    ProfesorModule,
    AzureModule,
    ParametersModule,
    MenuModule,
    LandingPageModule,
    BunnyModule,
    XapiModule,
    ProgresoModule,
    AdminModule,
    PlantillasCertificacionModule,
    ProgresoCursoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}