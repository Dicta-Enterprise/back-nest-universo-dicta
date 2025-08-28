import { Injectable } from '@nestjs/common';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';
import { Result } from 'src/shared/domain/result/result';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaPaginationDto } from 'src/application/dto/galaxia';
@Injectable()
export class GetAllGalaxiaUseCase {
  constructor(
    private readonly galaxiaService: GalaxiasService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(galaxiaPaginationDto: GalaxiaPaginationDto): Promise<Result<Galaxia[]>> {
      try {
        const galaxia = await this.galaxiaService.ListarGalaxia(galaxiaPaginationDto);
  
        return Result.okList(galaxia);
      } catch (error) {
        return Result.fail(error);
      }
    }
}
