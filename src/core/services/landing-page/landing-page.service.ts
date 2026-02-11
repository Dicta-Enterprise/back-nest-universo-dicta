import { HttpStatus, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CreateLandingPageDto } from 'src/application/dto/lading-page/create-landing-page.dto';
import { UpdateLandingPageDto } from 'src/application/dto/lading-page/update-landing-page.dto';
import { LANDING_PAGE_REPOSITORY } from 'src/core/constants/constants';
import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';
import { LandingPageRepository } from 'src/core/repositories/landing-page/landing-page.repository';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { ValidatorService } from 'src/shared/application/validation/validator.service';

@Injectable()
export class LandingPageService {
  constructor(
    @Inject(LANDING_PAGE_REPOSITORY)
    private repository: LandingPageRepository,
    private readonly validator: ValidatorService,
  ) {}

  async create(dto: CreateLandingPageDto): Promise<LandingPage> {
    await this.validator.validate(dto, CreateLandingPageDto);

    const existe = await this.repository.findByTitulo(dto.titulo);
    if (existe) {
      throw new BussinesRuleException(
        'Landing page ya existe con ese título',
        HttpStatus.BAD_REQUEST,
        {
          titulo: dto.titulo,
          codigoError: 'LANDING_PAGE_DUPLICADA',
        },
      );
    }
    const landingPage = new LandingPage(
      null,
      dto.titulo,
      dto.descripcion,
      dto.imagenPrincipal,
      dto.contenido,
      dto.estado || true,
      dto.slug,
      dto.metaKeywords,
      dto.landingUrl,
      new Date(),
      new Date(),
      dto.itemImagenesLanding || [],
      dto.itemColores || [],
    );
    return this.repository.save(landingPage);
  }

  async findAll(): Promise<LandingPage[]> {
    return this.repository.findAllActive();
  }

  async findOne(id: string) {
    const existe = await this.repository.findById(id);

    if (!existe) {
      throw new BussinesRuleException(
        'Landing page no encontrada',
        HttpStatus.NOT_FOUND,
        {
          id: id,
          codigoError: 'LANDING_PAGE_NO_ENCONTRADA',
        },
      );
    }
    return existe;
  }

  async update(id: string, dto: UpdateLandingPageDto): Promise<LandingPage> {
    await this.validator.validate(dto, UpdateLandingPageDto);

    const landingPage = new LandingPage(
      null,
      dto.titulo,
      dto.descripcion,
      dto.imagenPrincipal,
      dto.contenido,
      dto.estado || true,
      dto.slug,
      dto.metaKeywords,
      dto.landingUrl,
      new Date(),
      new Date(),
      dto.itemImagenesLanding || [],
      dto.itemColores || [],
    );
    return this.repository.update(id, landingPage);
  }

  async remove(id: string) {
    const landingPage = await this.findOne(id);
    const estado: boolean = landingPage.estado === true ? false : true;
    return this.repository.delete(id, estado);
  }
}
