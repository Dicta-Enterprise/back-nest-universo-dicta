import { Module } from '@nestjs/common';
import { PlanetasService } from './planetas.service';
import { PlanetasController } from './planetas.controller';

@Module({
  controllers: [PlanetasController],
  providers: [PlanetasService],
})
export class PlanetasModule {}
