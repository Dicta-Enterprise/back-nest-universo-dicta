import { Injectable } from '@nestjs/common';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetAllGalaxiaUseCase {
  constructor(private readonly galaxiaService: GalaxiasService) {}

  async execute() {
    try {
      const galaxias = await this.galaxiaService.findAll();
      return Result.ok(galaxias);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
