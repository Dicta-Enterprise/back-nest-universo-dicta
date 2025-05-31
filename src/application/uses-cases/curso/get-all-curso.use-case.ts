import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Curso } from "src/core/entities/curso/curso.entity";
import { CursosService } from "src/core/services/curso/cursos.service";
import { Result } from "src/shared/domain/result/result";

@Injectable()
export class GetAllCursoUseCase{
    constructor(
        private readonly cursoService: CursosService,
        private readonly eventEmitter: EventEmitter2,
    ){}

    async execute(): Promise<Result<Curso[]>> {
        try {
            const cursos = await this.cursoService.listarCursos();

            return Result.okList(cursos);
        } catch (error) {
            return Result.fail(error);
        }
    }
}