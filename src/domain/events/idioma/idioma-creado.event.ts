import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { IDomainEvent } from 'src/shared/domain/events/domain-event.interface';

export class IdiomaEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly idioma: Idioma;

  constructor(idioma: Idioma) {
    this.dateTimeOccurred = new Date();
    this.idioma = idioma;
  }

  public getAggregateId(): string {
    return this.idioma.id;
  }
}



