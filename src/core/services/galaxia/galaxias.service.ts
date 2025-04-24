import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import { GALAXIA_REPOSITORY } from 'src/core/constants/constants';
import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericSingle } from 'src/shared/class/Generic.Class';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

@Injectable()
export class GalaxiasService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  constructor(
    @Inject(GALAXIA_REPOSITORY) private repository: GalaxiaRepository,
    private readonly validator: ValidatorService,
  ) {
    super();
  }

  async createGalaxia(createGalaxiaDto: CreateGalaxiaDto) {
    await this.validator.validate(createGalaxiaDto, CreateGalaxiaDto);

    const existe = await this.repository.findByName(createGalaxiaDto.nombre);
    if (existe) {
      throw new BussinesRuleException(
        'Ya existe una galaxia con ese nombre',
        HttpStatus.BAD_REQUEST,
        {
          nombre: createGalaxiaDto.nombre,
          codigoError: 'GALAXIA_DUPLICADA',
        },
      );
    }

    const galaxia = new Galaxia(
      null,
      createGalaxiaDto.nombre,
      createGalaxiaDto.descripcion,
      createGalaxiaDto.imagen,
      createGalaxiaDto.estado,
      createGalaxiaDto.fechaCreacion,
      createGalaxiaDto.fechaActualizacion,
    );

    return this.repository.save(galaxia);
  }

  async findAll() {
    return this.repository.findAllActive();
  }

  async findOne(id: string) {
    try {
      const galaxia = await this.galaxia.findUnique({
        where: {
          id: id,
          estado: 'ACTIVO',
        },
      });

      if (!galaxia) {
        throw new CustomError(
          'No se encontró la galaxia',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericSingle(galaxia, HttpStatus.OK, 'Galaxia encontrada');
    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateGalaxiaDto: UpdateGalaxiaDto) {
    try {
      const galaxia = await this.galaxia.update({
        where: {
          id: id,
        },
        data: updateGalaxiaDto,
      });

      if (!galaxia) {
        throw new CustomError(
          'No se encontró la galaxia',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericSingle(galaxia, HttpStatus.OK, 'Galaxia actualizada');
    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const galaxia = await this.galaxia.update({
        where: {
          id: id,
        },
        data: {
          estado: 'INACTIVO',
        },
      });

      if (!galaxia) {
        throw new CustomError(
          'No se encontró la galaxia',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericSingle(galaxia, HttpStatus.OK, 'Galaxia eliminada');
    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
