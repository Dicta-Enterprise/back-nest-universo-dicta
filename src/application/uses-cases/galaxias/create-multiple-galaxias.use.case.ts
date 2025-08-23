import { Injectable } from '@nestjs/common';
import { CreateMultipleGalaxiasDto } from 'src/application/dto/galaxia/create-multiple-galaxias.dto';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreateMultipleGalaxiasUseCase {
  constructor(private readonly galaxiaService: GalaxiasService) {}

  async execute(dto: CreateMultipleGalaxiasDto): Promise<Result<Galaxia[]>> {
    try {
      const galaxias = await this.galaxiaService.crearMultiplesGalaxias(dto);
      return Result.ok(galaxias);
    } catch (error) {
      return Result.fail(error);
    }
  }
}