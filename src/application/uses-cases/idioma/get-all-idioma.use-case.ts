import { Injectable } from '@nestjs/common';
import { IdiomaService } from '../../../core/services/idioma/idioma.service';

@Injectable()
export class GetAllIdiomaUseCase {
  constructor(private readonly idiomaService: IdiomaService) {}

  async execute() {
    return this.idiomaService.listarIdiomas();
  }
}