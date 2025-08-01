import { Injectable } from "@nestjs/common";
import { ProfesorService } from '../../../core/services/profesor/profesor.service';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { updateProfesorDto } from "src/application/dto/profesor";
import { Result } from "src/shared/domain/result/result";
import { Profesor } from "src/core/entities/profesor/profesor.entity";
import { profesorEvent } from "src/domain/events/profesor/profesor-creado.event";

@Injectable()
export class UpdateProfesorUseCase{
    constructor(
        private readonly profesorService: ProfesorService,
        private readonly eventEmitter: EventEmitter2,
    ){}

    async execute(id: string, dtoProfesor: updateProfesorDto): Promise<Result<Profesor>>{

        try {
            const profesor = await this.profesorService.actualizarProfesor(id, dtoProfesor);
            this.eventEmitter.emit('Profesor actualizado.', new profesorEvent(profesor));
            return Result.ok(profesor);

        } catch(error){
            return Result.fail(error);
        }
    }
}