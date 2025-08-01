import { Injectable } from '@nestjs/common';
import { IdiomaService } from '../../../core/services/idioma/idioma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetAllIdiomaUseCase {
  constructor(
    private readonly idiomaService: IdiomaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
async execute(): Promise<Result<Idioma[]>> {
    try {
      const Idioma = await this.idiomaService.listarIdiomas();

      return Result.okList(Idioma);
    } catch (error) {
      return Result.fail(error);
    }
  }
}