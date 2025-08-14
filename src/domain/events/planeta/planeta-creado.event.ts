import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { IDomainEvent } from 'src/shared/domain/events/domain-event.interface';

export class PlanetaEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly planeta: Planeta;

  constructor(planeta: Planeta) {
    this.dateTimeOccurred = new Date();
    this.planeta = planeta;
  }

  public getAggregateId(): string {
    return this.planeta.id;
  }
}
