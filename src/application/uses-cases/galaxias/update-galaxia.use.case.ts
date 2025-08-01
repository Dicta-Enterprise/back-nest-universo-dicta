import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { GalaxiaEvent } from 'src/domain/events/galaxia/galaxia-creado.event';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ActualizarGalaxiaCasoDeUso {
  constructor(
    private readonly galaxiaService: GalaxiasService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    id: string,
    dto: UpdateGalaxiaDto,
  ): Promise<Result<Galaxia>> {
    try {
      const galaxia = await this.galaxiaService.ActualizarGalaxia(id, dto);
      this.eventEmitter.emit('galaxia.actualizada', new GalaxiaEvent(galaxia));
      return Result.ok(galaxia);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
