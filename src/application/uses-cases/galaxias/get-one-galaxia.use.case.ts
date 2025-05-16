import { Injectable } from '@nestjs/common';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetOneGalaxiaUseCase {
  constructor(private readonly galaxiaService: GalaxiasService) {}

  async execute(id: string): Promise<Result<Galaxia>> {
    try {
      const galaxia = await this.galaxiaService.findOne(id);

      return Result.ok(galaxia);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
