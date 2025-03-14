import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateGalaxiaDto } from './dto/create-galaxia.dto';
import { UpdateGalaxiaDto } from './dto/update-galaxia.dto';
import { PrismaClient } from '@prisma/client';
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
      const galaxia = await this.galaxia.create({
        data: createGalaxiaDto,
      });

      return new GenericSingle(galaxia, HttpStatus.CREATED, 'Galaxia creada');
    } catch (error) {
      throw new CustomError(
        'Error al crear la galaxia',
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
        'Error al obtener las galaxias',
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

      return new GenericSingle(galaxia, HttpStatus.OK, 'Galaxia encontrada');

    } catch (error) {
      throw new CustomError(
        'Error al obtener la galaxia',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateGalaxiaDto: UpdateGalaxiaDto) {
    try {
      const galaxia = await this.galaxia.update({
        where: { id: id },
        data: updateGalaxiaDto,
      });

      return new GenericSingle(galaxia, HttpStatus.OK, 'Galaxia actualizada');

    } catch (error) {
      throw new CustomError(
        'Error al actualizar la galaxia',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const galaxia = await this.galaxia.update({
        where: { id: id },
        data: { estado: 'INACTIVO' },
      });

      return new GenericSingle(galaxia, HttpStatus.OK, 'Galaxia eliminada');

    } catch (error) {
      throw new CustomError(
        'Error al eliminar la galaxia',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
