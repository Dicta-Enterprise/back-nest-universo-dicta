
import { Injectable } from '@nestjs/common';
import { CursosService } from 'src/core/services/curso/cursos.service';
import { Result } from "src/shared/domain/result/result";

@Injectable() 
export class GetAllCursoLiteUseCase {
  constructor(private readonly service: CursosService) {}

  async execute() {
    const data = await this.service.findAllActiveLite(); 
    return Result.ok(data);
  }
}
