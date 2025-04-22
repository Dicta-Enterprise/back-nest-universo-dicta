import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';;
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { CategoriaEvent } from 'src/domain/events/categoria/categoria-creada.event';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetOneCategoriaUseCase {
  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string): Promise<Result<Categoria>> {
    try {
      const categorias = await this.categoriaService.obtenerUnaCategoria(id);

      this.eventEmitter.emit(
        'categoria.obtenida',
        new CategoriaEvent(categorias),
      );

      return Result.ok(categorias);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
