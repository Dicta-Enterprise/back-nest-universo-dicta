import { Module } from '@nestjs/common';
import { PlanetasService } from '../../../core/services/planeta/planetas.service';
import { PlanetasController } from './planetas.controller';

@Module({
  controllers: [PlanetasController],
  providers: [PlanetasService],
})
export class PlanetasModule {}
