import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlanetaPaginationDto } from 'src/application/dto/planeta/PlanetaPagination.dto';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetAllPlanetaUseCase {
  constructor(
    private readonly planetaService: PlanetasService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(planetaPaginationDto: PlanetaPaginationDto): Promise<Result<Planeta[]>> {
    try {
      const planetas = await this.planetaService.listarPlanetas(planetaPaginationDto);

      return Result.okList(planetas);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
