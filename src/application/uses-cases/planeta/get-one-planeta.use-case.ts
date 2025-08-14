import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { PlanetaEvent } from 'src/domain/events/planeta/planeta-creado.event';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetOnePlanetaUseCase {
  constructor(
    private readonly planetaService: PlanetasService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string): Promise<Result<Planeta>> {
    try {
      const planetas = await this.planetaService.listarUnPlaneta(id);

      this.eventEmitter.emit('planeta.obtenido', new PlanetaEvent(planetas));

      return Result.ok(planetas);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
