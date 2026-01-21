import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { GalaxiaEvent } from 'src/domain/events/galaxia/galaxia-creado.event';
import { Result } from 'src/shared/domain/result/result';




@Injectable()
export class DeleteGalaxiaUseCase {
    constructor(
        private readonly GalaxiaService: GalaxiasService,
        private readonly eventEmitter: EventEmitter2,
    ) { }
     async execute(id: string): Promise<Result<Galaxia>> {
          try {
            const Galaxia = await this.GalaxiaService.eliminarGalaxia(id);
            this.eventEmitter.emit(
              'categoria.eliminada',
              new GalaxiaEvent(Galaxia),
            );
            return Result.ok(Galaxia);
          } catch (error) {
            return Result.fail(error);
          }
        }
}