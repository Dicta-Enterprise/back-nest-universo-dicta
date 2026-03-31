import { Injectable } from '@nestjs/common';
import { CreatePlanetaDto } from 'src/application/dto/planeta';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreateMultiplePlanetaUseCase {
  constructor(
    private readonly planetaService: PlanetasService,
  ) {}

  async execute(dtos: CreatePlanetaDto[]): Promise<Result<Planeta[]>> {
    try {
      const planetas = await Promise.all(
        dtos.map((dto) => this.planetaService.crearPlaneta(dto)),
      );
      return Result.ok(planetas);
    } catch (error) {
      return Result.fail(error);
    }
  }
}