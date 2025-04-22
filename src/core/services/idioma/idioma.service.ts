import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateIdiomaDto } from 'src/application/dto/idioma/create-idioma.dto';
import { IDIOMA_REPOSITORY } from 'src/core/constants/constants';
import { Estandar } from 'src/core/entities/estandar/estandar.entity';
import { IdiomaRepository } from 'src/core/repositories/idioma/idioma.repostitory';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

@Injectable()
export class IdiomaService {
  constructor(
    @Inject(IDIOMA_REPOSITORY)
    private repository: IdiomaRepository,
    private readonly validator: ValidatorService,
  ) {}

  async crearIdioma(dto: CreateIdiomaDto): Promise<Estandar> {
    await this.validator.validate(dto, CreateIdiomaDto);
    const existe = await this.repository.findByName(dto.descripcion);

    if (existe) {
      throw new BussinesRuleException(
        'El idioma ya existe',
        HttpStatus.BAD_REQUEST,
        {
          nombre: dto.descripcion,
          codigoError: 'IDIOMA_DUPLICADO',
        },
      );
    }

    const idioma = new Estandar(null, dto.descripcion);

    return this.repository.save(idioma);
  }
}
