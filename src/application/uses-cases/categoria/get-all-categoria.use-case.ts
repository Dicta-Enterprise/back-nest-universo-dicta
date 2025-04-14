import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CategoriaResponseDto } from 'src/application/dto/categoria';
import { CategoriaService } from 'src/core/services/categoria/categoria.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetAllCategoriaUseCase {
  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(): Promise<Result<CategoriaResponseDto[]>> {
    const categorias = await this.categoriaService.listarCategorias();
    const categoriasDto = categorias.map((c) => ({
      ...c,
      fechaActualizacion: c.fechaActualizacion || new Date(),
    }));
    return Result.okList(categoriasDto);
  }
}
