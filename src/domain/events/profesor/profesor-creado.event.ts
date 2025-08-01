import { Profesor } from "src/core/entities/profesor/profesor.entity";
import { IDomainEvent } from "src/shared/domain/events/domain-event.interface";


export class profesorEvent implements IDomainEvent{
    public readonly dateTimeOccurred: Date;
    public readonly profesor: Profesor;

    constructor(profesor: Profesor){
        this.dateTimeOccurred = new Date();
        this.profesor = profesor;
    }

    public getAggregateId(): string {
        return this.profesor.id;
    }
}