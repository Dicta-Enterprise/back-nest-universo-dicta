import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateIdiomaDto } from 'src/application/dto/idioma'
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { IdiomaService } from 'src/core/services/idioma/idioma.service';
import { IdiomaEvent } from 'src/domain/events/idioma/idioma-creado.event';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ActualizarIdiomaCasoDeUso {
  constructor(
    private readonly idiomaService: IdiomaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async ejecutar(
    id: string,
    dto: UpdateIdiomaDto,
  ): Promise<Result<Idioma>> {
    try {
      const idioma = await this.idiomaService.actualizarIdioma(id, dto);
      this.eventEmitter.emit('idioma.actualizado', new IdiomaEvent(idioma));
      return Result.ok(idioma);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
