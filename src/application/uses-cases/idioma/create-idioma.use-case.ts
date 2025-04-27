import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateIdiomaDto } from 'src/application/dto/idioma/create-idioma.dto';
import { Idioma } from 'src/core/entities/idioma/idioma.entity'
import { IdiomaService } from 'src/core/services/idioma/idioma.service';
import { Result } from 'src/shared/domain/result/result';


@Injectable()
export class CreateIdiomaUseCase {
  constructor(
    private readonly idiomaService: IdiomaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreateIdiomaDto): Promise<Result<Idioma>> {
    try {
     
      const idioma = await this.idiomaService.crearIdioma(dto);
      return Result.ok(idioma);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
