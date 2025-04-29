import { Injectable } from '@nestjs/common';
import { IdiomaService } from '../../../core/services/idioma/idioma.service';
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { Result } from 'src/shared/domain/result/result';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IdiomaEvent } from 'src/domain/events/idioma/idioma-creado.event';
@Injectable()
export class GetOneIdiomaUseCase {
  constructor(
    private readonly idiomaService: IdiomaService,
     private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string): Promise<Result<Idioma>> {
      try {
        const Idioma = await this.idiomaService.obtenerUnIdioma(id);
  
        this.eventEmitter.emit(
          'categoria.obtenida',
          new IdiomaEvent(Idioma),
        );
  
        return Result.ok(Idioma);
      } catch (error) {
        return Result.fail(error);
      }
    }
}