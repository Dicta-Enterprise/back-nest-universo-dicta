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

    const planetaExistente = await this.repository.findByCodigo(dtoPlaneta.codigo);
    if (planetaExistente) {
      throw new BussinesRuleException(
        `El código ${dtoPlaneta.codigo} ya está en uso`,
        HttpStatus.BAD_REQUEST,
        {
          codigo: dtoPlaneta.codigo,
          codigoError: 'CODIGO_DUPLICADO',
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
      dtoPlaneta.codigo,
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

    const planetaExistente = await this.repository.findById(id);

    if (!planetaExistente) {
      throw new BussinesRuleException(
        'El planeta no existe.',
        HttpStatus.NOT_FOUND,
        {
          id: id,
          codigoError: 'PLANETA_NO_ENCONTRADO',
        },
      );
    }

    if (dtoPlaneta.codigo && dtoPlaneta.codigo !== planetaExistente.codigo) {
      const planetaConCodigo = await this.repository.findByCodigo(dtoPlaneta.codigo);
      if (planetaConCodigo) {
        throw new BussinesRuleException(
          `El código ${dtoPlaneta.codigo} ya está en uso`,
          HttpStatus.BAD_REQUEST,
          {
            codigo: dtoPlaneta.codigo,
            codigoError: 'CODIGO_DUPLICADO',
          },
        );
      }
    }

    if (!dtoPlaneta.galaxiaId) {
      throw new BussinesRuleException(
        'Debe enviar galaxiaId para actualizar el planeta',
        HttpStatus.BAD_REQUEST,
        {
          codigoError: 'GALAXIA_ID_REQUERIDO',
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
      id,
      dtoPlaneta.codigo ?? planetaExistente.codigo,
      dtoPlaneta.nombre ?? planetaExistente.nombre,
      dtoPlaneta.categoria ?? planetaExistente.categoria,
      galaxia.nombre,
      dtoPlaneta.textura ?? planetaExistente.textura,
      dtoPlaneta.url ?? planetaExistente.url,
      dtoPlaneta.imagenResumen ?? planetaExistente.imagenResumen,
      dtoPlaneta.resumenCurso ?? planetaExistente.resumenCurso,
      dtoPlaneta.estado ?? planetaExistente.estado,
      dtoPlaneta.galaxiaId,
      dtoPlaneta.info ?? planetaExistente.info,
      dtoPlaneta.peligros ?? planetaExistente.peligros,
      dtoPlaneta.beneficios ?? planetaExistente.beneficios,
    );

    return this.repository.update(id, planeta);
  }
}