import { Injectable } from "@nestjs/common";
import { ProfesorService } from '../../../core/services/profesor/profesor.service';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Result } from "src/shared/domain/result/result";
import { Profesor } from "src/core/entities/profesor/profesor.entity";
import { profesorEvent } from "src/domain/events/profesor/profesor-creado.event";

@Injectable()
export class GetOneProfesorUseCase{
    constructor(
        private readonly profesorService: ProfesorService,
        private readonly eventEmitter: EventEmitter2,
    ){}

    async execute(id: string): Promise<Result<Profesor>>{

        try {
            const profesor = await this.profesorService.listarUnProfesor(id);
            this.eventEmitter.emit('Profesor encontrado.', new profesorEvent(profesor));
            return Result.ok(profesor);

        } catch(error){
            return Result.fail(error);
        }
    }
}