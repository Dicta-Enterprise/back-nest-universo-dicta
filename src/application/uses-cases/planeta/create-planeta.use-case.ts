import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlanetaDto } from 'src/application/dto/planeta';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { PlanetaEvent } from 'src/domain/events/planeta/planeta-creado.event';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreatePlanetaUseCase {
  constructor(
    private readonly planetaService: PlanetasService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreatePlanetaDto): Promise<Result<Planeta>> {
    try {
      const planeta = await this.planetaService.crearPlaneta(dto);
      this.eventEmitter.emit('planeta.creado', new PlanetaEvent(planeta));
      return Result.ok(planeta);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
