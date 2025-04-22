import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericArray, GenericSingle } from 'src/shared/class/Generic.Class';

@Injectable()
export class GalaxiasService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  constructor() {
    super();
  }

  async create(createGalaxiaDto: CreateGalaxiaDto) {
    try {
      const oneGalaxia = await this.galaxia.findUnique({
        where: {
          nombre: createGalaxiaDto.nombre,
        },
      });

      if (oneGalaxia) {
        return new CustomError(
          'Ya existe una galaxia con ese nombre',
          'Conflict',
          HttpStatus.BAD_REQUEST,
        );
      }

      const galaxia = await this.galaxia.create({
        data: createGalaxiaDto,
      });

      return new GenericSingle(galaxia, HttpStatus.CREATED, 'Galaxia creada');
    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const galaxias = await this.galaxia.findMany({
        where: {
          estado: 'ACTIVO',
        },
      });

      if (!galaxias) {
        throw new CustomError(
          'No se encontraron galaxias',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericArray(galaxias, HttpStatus.OK, 'Galaxias encontradas');
    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
