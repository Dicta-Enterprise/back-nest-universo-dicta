import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetAllCategoriaUseCase {
  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(): Promise<Result<Categoria[]>> {
    try {
      const categorias = await this.categoriaService.listarCategorias();

      return Result.okList(categorias);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
