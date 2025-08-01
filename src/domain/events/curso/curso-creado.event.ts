import { Curso } from "src/core/entities/curso/curso.entity";
import { IDomainEvent } from "src/shared/domain/events/domain-event.interface";

export class CursoCreadoEvent implements IDomainEvent{
    public readonly dateTimeOccurred: Date;
    public readonly curso: Curso;

    constructor(curso: Curso){
        this.dateTimeOccurred= new Date();
        this.curso = curso;
    }

    public getAggregateId(): string {
        return this.curso.id;
    }
}