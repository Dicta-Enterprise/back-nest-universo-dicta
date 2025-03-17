import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateIdiomaDto } from './dto/create-idioma.dto';
import { GenericArray, GenericSingle } from 'src/shared/class/Generic.Class';
import { CustomError } from 'src/shared/class/Error.Class';
import { UpdateIdiomaDto } from './dto/update-idioma.dto';

@Injectable()
export class IdiomasService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  constructor() {
    super();
  }

  async create(createIdiomaDto: CreateIdiomaDto) {
    try {
      const idioma = await this.idioma.create({
        data: createIdiomaDto,
      });

      return new GenericSingle(idioma, HttpStatus.CREATED, 'Idioma creado');
    } catch (error) {
      throw new CustomError(
        'Error al crear el idioma',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findAll() {
    try {
      const idiomas = await this.idioma.findMany({
        where: {
          estado: 'ACTIVO',
        },
      });

      if (!idiomas) {
        throw new CustomError(
          'No se encontraron idiomas',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericArray(idiomas, HttpStatus.OK, 'Idiomas encontrados');
    } catch (error) {
      throw new CustomError(
        'Error al obtener idiomas',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const idioma = await this.idioma.findUnique({
        where: {
          id: id,
          estado: 'ACTIVO',
        },
      });

      return new GenericSingle(idioma, HttpStatus.OK, 'Idioma encontrado');

    } catch (error) {
      throw new CustomError(
        'Error al obtener el idioma',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateIdiomaDto: UpdateIdiomaDto) {
    try {
      const idioma = await this.idioma.update({
        where: { id: id },
        data: updateIdiomaDto,
      });

      return new GenericSingle(idioma, HttpStatus.OK, 'Idioma actualizada');

    } catch (error) {
      throw new CustomError(
        'Error al actualizar el idioma',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const idioma = await this.idioma.update({
        where: { id: id },
        data: { estado: 'INACTIVO' },
      });

      return new GenericSingle(idioma, HttpStatus.OK, 'Idioma eliminado');

    } catch (error) {
      throw new CustomError(
        'Error al eliminar el idioma',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
