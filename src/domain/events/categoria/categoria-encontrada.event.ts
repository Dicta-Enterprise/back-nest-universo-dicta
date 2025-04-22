import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { IDomainEvent } from 'src/shared/domain/events/domain-event.interface';

export class CategoriaEncontradaEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly categorias: Categoria[];

  constructor(categoria: Categoria[]) {
    this.dateTimeOccurred = new Date();
    this.categorias = categoria;
  }

  public getAggregateId(): string {
    return this.categorias.map((categoria) => categoria.id).join(', ');
  }
}
