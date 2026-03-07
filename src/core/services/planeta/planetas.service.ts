import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EstadoGenerico } from '@prisma/client';
import { CreatePlanetaDto } from 'src/application/dto/planeta/create-planeta.dto';
import { PlanetaPaginationDto } from 'src/application/dto/planeta/PlanetaPagination.dto';
import { UpdatePlanetaDto } from 'src/application/dto/planeta/update-planeta.dto';
import { PLANETA_REPOSITORY } from 'src/core/constants/constants';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetaRepository } from 'src/core/repositories/planeta/planeta.respository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { GalaxiasService } from 'src/core/services/galaxia/galaxias.service';

@Injectable()
export class PlanetasService {
  constructor(
    @Inject(PLANETA_REPOSITORY)
    private repository: PlanetaRepository,
    private readonly validator: ValidatorService,
    private readonly galaxiasService: GalaxiasService,
  ) {}

  async crearPlaneta(dtoPlaneta: CreatePlanetaDto): Promise<Planeta> {
    await this.validator.validate(dtoPlaneta, CreatePlanetaDto);

    const existe = await this.repository.findByName(dtoPlaneta.nombre);
    if (existe) {
      throw new BussinesRuleException(
        `El planeta con el nombre ${dtoPlaneta.nombre} ya existe en esta galaxia `,
        HttpStatus.BAD_REQUEST,
        {
          nombre: dtoPlaneta.nombre,
          codigoError: 'PLANETA_DUPLICADO',
        },
      );
    }
    const galaxia = await this.galaxiasService.obtenerGalaxia(dtoPlaneta.galaxiaId);
    if (!galaxia) {
      throw new BussinesRuleException(
        `La galaxia con ID ${dtoPlaneta.galaxiaId} no existe`,
        HttpStatus.BAD_REQUEST,
        {
          galaxiaId: dtoPlaneta.galaxiaId,
          codigoError: 'GALAXIA_NO_ENCONTRADA',
        },
      );
    }


    const planeta = new Planeta(
      null,
      dtoPlaneta.nombre,
      dtoPlaneta.categoria,
      galaxia.nombre,
      dtoPlaneta.textura,
      dtoPlaneta.url,
      dtoPlaneta.imagenResumen,
      dtoPlaneta.resumenCurso,
      dtoPlaneta.estado ?? EstadoGenerico.ACTIVO,
      dtoPlaneta.galaxiaId,
      dtoPlaneta.info,
      dtoPlaneta.peligros ?? [],
      dtoPlaneta.beneficios ?? [],
    );

    return this.repository.save(planeta);
  }

  async listarPlanetas(planetaPaginationDto: PlanetaPaginationDto): Promise<Planeta[]> {
    return this.repository.findAllActive(planetaPaginationDto);
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
    const existe = await this.repository.findByName(dtoPlaneta.nombre);
    if (existe) {
      throw new BussinesRuleException(
        `No puedes editar el planeta. Ya existe otro con el nombre ${dtoPlaneta.nombre} en esta galaxia`,
        HttpStatus.BAD_REQUEST,
        {
          nombre: dtoPlaneta.nombre,
          codigoError: 'PLANETA_DUPLICADO',
        },
      );
    }

        const galaxia = await this.galaxiasService.obtenerGalaxia(dtoPlaneta.galaxiaId);
    if (!galaxia) {
      throw new BussinesRuleException(
        `La galaxia con ID ${dtoPlaneta.galaxiaId} no existe`,
        HttpStatus.BAD_REQUEST,
        {
          galaxiaId: dtoPlaneta.galaxiaId,
          codigoError: 'GALAXIA_NO_ENCONTRADA',
        },
      );
    }

    const planeta = new Planeta(
      null,
      dtoPlaneta.nombre,
      dtoPlaneta.categoria,
      dtoPlaneta.galaxia,
      dtoPlaneta.textura,
      dtoPlaneta.url,
      dtoPlaneta.imagenResumen,
      dtoPlaneta.resumenCurso,
      dtoPlaneta.estado ?? EstadoGenerico.ACTIVO,
      dtoPlaneta.galaxiaId,
      dtoPlaneta.info,
      dtoPlaneta.peligros ?? [],
      dtoPlaneta.beneficios ?? [],
    );

    return this.repository.update(id, planeta);
  }
}
