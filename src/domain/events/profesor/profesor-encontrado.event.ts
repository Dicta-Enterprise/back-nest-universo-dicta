import { Profesor } from "src/core/entities/profesor/profesor.entity";
import { IDomainEvent } from "src/shared/domain/events/domain-event.interface";


export class profesorEncontradoEvent implements IDomainEvent{
    public readonly dateTimeOccurred: Date;
    public readonly profesores: Profesor[];

    constructor(profesor: Profesor[]){
        this.dateTimeOccurred = new Date();
        this.profesores = profesor;
    }

    public getAggregateId(): string {
        return this.profesores.map((profesor) => profesor.id).join(', ');
    }
}