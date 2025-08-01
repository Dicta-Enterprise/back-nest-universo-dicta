import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Curso } from "src/core/entities/curso/curso.entity";
import { CursosService } from "src/core/services/curso/cursos.service";
import { CursoCreadoEvent } from "src/domain/events/curso/curso-creado.event";
import { Result } from "src/shared/domain/result/result";

@Injectable()
export class GetOneCursoUseCase{
    constructor(
        private readonly cursoService: CursosService,
        private readonly eventEmitter: EventEmitter2,
    ){}

    async execute(id: string): Promise<Result<Curso>> {
    try {
      const curso = await this.cursoService.obtenerUnCurso(id);

      this.eventEmitter.emit(
        'curso obtenido',
        new CursoCreadoEvent(curso),
      );

      return Result.ok(curso);
    } catch (error) {
      return Result.fail(error);
    }
  }
}