import { Injectable } from '@nestjs/common';
import { IdiomaService } from '../../../core/services/idioma/idioma.service';

@Injectable()
export class DeleteIdiomaUseCase {
  constructor(private readonly idiomaService: IdiomaService) {}

  async execute(id: string) {
    return this.idiomaService.eliminarIdioma(id);
  }
}