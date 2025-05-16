import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetAllPlanetaUseCase {
  constructor(
    private readonly planetaService: PlanetasService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(): Promise<Result<Planeta[]>> {
    try {
      const planetas = await this.planetaService.listarPlanetas();

      return Result.okList(planetas);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
