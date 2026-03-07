import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePlanetaDto } from 'src/application/dto/planeta';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { PlanetaEvent } from 'src/domain/events/planeta/planeta-creado.event';

@Injectable()
export class CreateMultiplePlanetaUseCase {
  constructor(
    private readonly planetaService: PlanetasService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dtos: CreatePlanetaDto[]): Promise<Planeta[]> {
    const planetas = await Promise.all(
      dtos.map((dto) => this.planetaService.crearPlaneta(dto)),
    );

    planetas.forEach((planeta) =>
      this.eventEmitter.emit('planeta.creado', new PlanetaEvent(planeta)),
    );

    return planetas;
  }
}
