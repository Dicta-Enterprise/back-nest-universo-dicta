import { Curso } from "src/core/entities/curso/curso.entity";
import { IDomainEvent } from "src/shared/domain/events/domain-event.interface";

export class CursoEncontradoEvent implements IDomainEvent {
    public readonly dateTimeOccurred: Date;
    public readonly cursos: Curso[];

    constructor(cursos: Curso[]){
        this.dateTimeOccurred = new Date();
        this.cursos = cursos;
    }

    public getAggregateId(): string {
        return this.cursos.map((curso) => curso.id).join(', ');
    }
}