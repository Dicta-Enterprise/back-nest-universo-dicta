import { Injectable } from '@nestjs/common';
import { IdiomaService } from '../../../core/services/idioma/idioma.service';
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { Result } from 'src/shared/domain/result/result';
import { IdiomaEvent } from 'src/domain/events/idioma/idioma-creado.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DeleteIdiomaUseCase {
  constructor(
    private readonly idiomaService: IdiomaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string): Promise<Result<Idioma>> {
      try {
        const idioma = await this.idiomaService.eliminarIdioma(id);
        this.eventEmitter.emit(
          'categoria.eliminada',
          new IdiomaEvent(idioma),
        );
        return Result.ok(idioma);
      } catch (error) {
        return Result.fail(error);
      }
    }
}