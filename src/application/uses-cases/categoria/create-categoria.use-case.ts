import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCategoriaDto } from 'src/application/dto/categoria';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { CategoriaEvent } from 'src/domain/events/categoria/categoria-creada.event';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreateCategoriaUseCase {
  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    dto: CreateCategoriaDto,
    imagenResult: string,
  ): Promise<Result<Categoria>> {
    
    const createDto = {...dto, imagenUrl: imagenResult };

    try {
      const categoria = await this.categoriaService.crearCategoria(createDto);
      this.eventEmitter.emit('categoria.creada', new CategoriaEvent(categoria));
      return Result.ok(categoria);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
