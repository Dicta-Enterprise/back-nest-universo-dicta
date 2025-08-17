import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EstadoGenerico } from '@prisma/client';
import { CreatePlanetaDto } from 'src/application/dto/planeta/create-planeta.dto';
import { UpdatePlanetaDto } from 'src/application/dto/planeta/update-planeta.dto';
import { PLANETA_REPOSITORY } from 'src/core/constants/constants';
import { InfoPlaneta } from 'src/core/entities/planeta/InfoPlaneta/infoPlaneta.entity';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetaRepository } from 'src/core/repositories/planeta/planeta.respository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

@Injectable()
export class PlanetasService {
  constructor(
    @Inject(PLANETA_REPOSITORY)
    private repository: PlanetaRepository,
    private readonly validator: ValidatorService,
  ) {}

  async crearPlaneta(dtoPlaneta: CreatePlanetaDto): Promise<Planeta> {
    await this.validator.validate(dtoPlaneta, CreatePlanetaDto);

    const existe = await this.repository.findByName(dtoPlaneta.nombre);
    if (existe) {
      throw new BussinesRuleException(
        'El planeta ya existe',
        HttpStatus.BAD_REQUEST,
        {
          nombre: dtoPlaneta.nombre,
          codigoError: 'PLANETA_DUPLICADO',
        },
      );
    }

    const info = new InfoPlaneta(
      dtoPlaneta.info.tipoRiesgo,
      dtoPlaneta.info.tamano,
      dtoPlaneta.info.composicion,
      dtoPlaneta.info.riesgo,
      dtoPlaneta.info.nivel,
      dtoPlaneta.info.ambiente,
      dtoPlaneta.info.temperatura,
      dtoPlaneta.info.villano,
    );

    const planeta = new Planeta(
      null,
      dtoPlaneta.grupo,
      dtoPlaneta.nombre,
      dtoPlaneta.tema,
      dtoPlaneta.textura,
      dtoPlaneta.url,
      EstadoGenerico.ACTIVO,
      info,
      new Date(),
      new Date(),
      null,
      dtoPlaneta.galaxiaId,
    );

    return this.repository.save(planeta);
  }

  async listarPlanetas(): Promise<Planeta[]> {
    return this.repository.findAllActive();
  }

  async listarUnPlaneta(id: string): Promise<Planeta> {
    const planeta = await this.repository.findById(id);

    if (!planeta) {
      throw new BussinesRuleException(
        'El planeta no existe.',
        HttpStatus.NOT_FOUND,
        {
          id: id,
          codigoError: 'PLANETA_NO_ENCONTRADO',
        },
      );
    }

    return planeta;
  }

  async eliminarPlaneta(id: string): Promise<Planeta> {
    const planeta = await this.repository.findById(id);

    if (!planeta) {
      throw new BussinesRuleException(
        'El planeta no existe.',
        HttpStatus.NOT_FOUND,
        {
          id: id,
          codigoError: 'PLANETA_NO_ENCONTRADO',
        },
      );
    }

    await this.repository.delete(id, EstadoGenerico.INACTIVO);
    return planeta;
  }

  async actualizarPlaneta(
    id: string,
    dtoPlaneta: UpdatePlanetaDto,
  ): Promise<Planeta> {
    await this.validator.validate(dtoPlaneta, UpdatePlanetaDto);

    const info = dtoPlaneta.info
      ? new InfoPlaneta(
          dtoPlaneta.info.tipoRiesgo,
          dtoPlaneta.info.tamano,
          dtoPlaneta.info.composicion,
          dtoPlaneta.info.riesgo,
          dtoPlaneta.info.nivel,
          dtoPlaneta.info.ambiente,
          dtoPlaneta.info.temperatura,
          dtoPlaneta.info.villano,
        )
      : undefined;

    const planeta = new Planeta(
      null,
      dtoPlaneta.grupo,
      dtoPlaneta.nombre,
      dtoPlaneta.tema,
      dtoPlaneta.textura,
      dtoPlaneta.url,
      dtoPlaneta.estado ? EstadoGenerico.ACTIVO : EstadoGenerico.INACTIVO,
      info,
      new Date(),
      new Date(),
      null,
      dtoPlaneta.galaxiaId,
    );

    return this.repository.update(id, planeta);
  }
}
