import { Injectable } from '@nestjs/common';
import { IdiomaService } from '../../../core/services/idioma/idioma.service';

@Injectable()
export class GetOneIdiomaUseCase {
  constructor(private readonly idiomaService: IdiomaService) {}

  async execute(id: string) {
    return this.idiomaService.obtenerUnIdioma(id);
  }
}