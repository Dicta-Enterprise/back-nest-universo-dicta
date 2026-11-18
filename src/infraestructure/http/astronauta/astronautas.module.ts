import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { AstronautasController } from './astronautas.controller';
import { AstronautaService } from 'src/core/services/astronauta/astronauta.service';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [AstronautasController],
  providers: [AstronautaService],
})
export class AstronautasModule {}
