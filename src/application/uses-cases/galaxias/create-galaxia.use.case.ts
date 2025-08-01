import { Injectable } from '@nestjs/common';
import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';

import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreateGalaxiaUseCase {
  constructor(private readonly galaxiaService: GalaxiasService) {}

  async execute(createGalaxiaDto: CreateGalaxiaDto): Promise<Result<Galaxia>> {
    try {
      const galaxia =
        await this.galaxiaService.crearGalaxia(createGalaxiaDto);

      return Result.ok(galaxia);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
