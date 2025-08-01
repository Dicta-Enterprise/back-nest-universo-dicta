import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CreateCursoDto } from "src/application/dto/curso";
import { Curso } from "src/core/entities/curso/curso.entity";
import { CursosService } from "src/core/services/curso/cursos.service";
import { CursoCreadoEvent } from "src/domain/events/curso/curso-creado.event";
import { Result } from "src/shared/domain/result/result";

@Injectable()
export class CreateCursoUseCase{
    constructor(
        private readonly cursoService: CursosService,
        private readonly eventEmitter: EventEmitter2,
    ){}

    async execute(
        dtoCurso: CreateCursoDto
      ): Promise<Result<Curso>> {
    
        try {
          const curso = await this.cursoService.crearCurso(dtoCurso);
          this.eventEmitter.emit('curso creado', new CursoCreadoEvent(curso));
          return Result.ok(curso);
        } catch (error) {
          return Result.fail(error);
        }
    }
}