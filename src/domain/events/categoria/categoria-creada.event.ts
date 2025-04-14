import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { IDomainEvent } from 'src/shared/domain/events/domain-event.interface';

export class CategoriaEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly categoria: Categoria;

  constructor(categoria: Categoria) {
    this.dateTimeOccurred = new Date();
    this.categoria = categoria;
  }

  public getAggregateId(): string {
    return this.categoria.id;
  }
}
