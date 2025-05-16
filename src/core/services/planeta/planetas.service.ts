import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EstadoGenerico } from '@prisma/client';
import { CreatePlanetaDto } from 'src/application/dto/planeta/create-planeta.dto';
import { UpdatePlanetaDto } from 'src/application/dto/planeta/update-planeta.dto';
import { PLANETA_REPOSITORY } from 'src/core/constants/constants';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetaRepository } from 'src/core/repositories/planeta/planeta.respository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

@Injectable()
export class PlanetasService {
  constructor(
    @Inject(PLANETA_REPOSITORY)
    private repository: PlanetaRepository,
    private readonly validator: ValidatorService
  ) {}

  async crearPlaneta(dto: CreatePlanetaDto): Promise<Planeta> {
    await this.validator.validate(dto, CreatePlanetaDto);

    const existe = await this.repository.findByName(dto.nombre);
    if (existe) {
      throw new BussinesRuleException(
        'El planeta ya existe',
        HttpStatus.BAD_REQUEST,
        {
          nombre: dto.nombre,
          codigoError: 'PLANETA_DUPLICADO',
        },
      );
    }

    const planeta = new Planeta(
      null,
      dto.nombre,
      dto.descripcion,
      dto.imagen,
      'ACTIVO',
      new Date(),
      new Date()
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

  async actualizarPlaneta(id: string, dto: UpdatePlanetaDto): Promise<Planeta> {
    await this.validator.validate(dto, UpdatePlanetaDto);

    const planeta = new Planeta(
      null,
      dto.nombre,
      dto.descripcion,
      dto.imagen,
      dto.estado ? 'ACTIVO' : 'INACTIVO',
      new Date(), 
      new Date()
    );

    return this.repository.update(id, planeta);
  }
}
