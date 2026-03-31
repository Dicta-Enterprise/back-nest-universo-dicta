import { Injectable } from '@nestjs/common';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class DeletePlanetaUseCase {
  constructor(
    private readonly planetaService: PlanetasService,
  ) {}

  async execute(id: string): Promise<Result<Planeta>> {
    try {
      const planeta = await this.planetaService.eliminarPlaneta(id);
      return Result.ok(planeta);
    } catch (error) {
      return Result.fail(error);
    }
  }
}