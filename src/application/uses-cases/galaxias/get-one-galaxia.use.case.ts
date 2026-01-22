import { Injectable } from '@nestjs/common';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { Result } from 'src/shared/domain/result/result';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GalaxiaEvent } from 'src/domain/events/galaxia/galaxia-creado.event';

@Injectable()
export class GetOneGalaxiaUseCase {
  constructor(
    private readonly galaxiaService: GalaxiasService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string): Promise<Result<Galaxia>> {
    try {
      const galaxia = await this.galaxiaService.obtenerGalaxia(id);

      this.eventEmitter.emit('galaxia.obtenida', new GalaxiaEvent(galaxia));
      return Result.ok(galaxia);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
