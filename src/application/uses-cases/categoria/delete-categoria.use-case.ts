import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { CategoriaEvent } from 'src/domain/events/categoria/categoria-creada.event';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class DeleteCategoriaUseCase {
  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string): Promise<Result<Categoria>> {
    try {
      const categoria = await this.categoriaService.eliminarCategoria(id);
      this.eventEmitter.emit(
        'categoria.eliminada',
        new CategoriaEvent(categoria),
      );
      return Result.ok(categoria);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
