import { Module } from '@nestjs/common';
import { GalaxiasService } from '../../../core/services/galaxia/galaxias.service';
import { GalaxiasController } from './galaxias.controller';

@Module({
  controllers: [GalaxiasController],
  providers: [GalaxiasService],
})
export class GalaxiasModule {}
