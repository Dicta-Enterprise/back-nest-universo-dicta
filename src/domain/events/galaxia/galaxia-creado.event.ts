import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { IDomainEvent } from 'src/shared/domain/events/domain-event.interface';

export class GalaxiaEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly galaxia: Galaxia;

  constructor(galaxia: Galaxia) {
    this.dateTimeOccurred = new Date();
    this.galaxia = galaxia;
  }

  public getAggregateId(): string {
    return this.galaxia.id;
  }
}
