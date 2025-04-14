import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateIdiomaDto } from 'src/application/dto/idioma/create-idioma.dto';
import { Estandar } from 'src/core/entities/estandar/estandar.entity';
import { IdiomaService } from 'src/core/services/idioma/idioma.service';
import { Result } from 'src/shared/domain/result/result';

export class CreateIdiomaUseCase {
  constructor(
    private readonly idiomaSercive: IdiomaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreateIdiomaDto): Promise<Result<Estandar>> {
    try {
      const idioma = await this.idiomaSercive.crearIdioma(dto);

      return Result.ok(idioma);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
