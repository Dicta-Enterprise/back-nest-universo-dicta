import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateCategoriaDto } from 'src/application/dto/categoria';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { CategoriaEvent } from 'src/domain/events/categoria/categoria-creada.event';
import { Result } from 'src/shared/domain/result/result';
import { Express } from 'express';

@Injectable()
export class UpdateCategoriaUseCase {
  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    id: string,
    dto: UpdateCategoriaDto,
    file?: Express.Multer.File,
  ): Promise<Result<Categoria>> {
    try {
      const categoria = await this.categoriaService.actualizarCategoria(
        id,
        dto,
        file, 
      );

      this.eventEmitter.emit('categoria.update', new CategoriaEvent(categoria));

      return Result.ok(categoria);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
