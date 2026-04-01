import { Injectable } from '@nestjs/common';
import { CreatePlanetaDto } from 'src/application/dto/planeta';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreatePlanetaUseCase {
  constructor(
    private readonly planetaService: PlanetasService,
  ) {}

  async execute(dto: CreatePlanetaDto): Promise<Result<Planeta>> {
    try {
      const planeta = await this.planetaService.crearPlaneta(dto);
      return Result.ok(planeta);
    } catch (error) {
      return Result.fail(error);
    }
  }
}