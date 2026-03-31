import { Injectable } from '@nestjs/common';
import { UpdatePlanetaDto } from 'src/application/dto/planeta';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetasService } from 'src/core/services/planeta/planetas.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class UpdatePlanetaUseCase {
  constructor(
    private readonly planetaService: PlanetasService,
  ) {}

  async execute(id: string, dto: UpdatePlanetaDto): Promise<Result<Planeta>> {
    try {
      const planeta = await this.planetaService.actualizarPlaneta(id, dto);
      return Result.ok(planeta);
    } catch (error) {
      return Result.fail(error);
    }
  }
}