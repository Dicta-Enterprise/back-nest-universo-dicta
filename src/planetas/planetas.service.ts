import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePlanetaDto } from './dto/create-planeta.dto';
import { UpdatePlanetaDto } from './dto/update-planeta.dto';
import { PrismaClient } from '@prisma/client';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericArray, GenericSingle } from '../shared/class/Generic.Class';
import { verificarExistenciaGalaxia, verificarGalaxiaSinAsignar, verificarNombreUnico, verificarExistenciaPlaneta, verificarPlanetaActivo } from './validations/planeta-business-validations';

@Injectable()
export class PlanetasService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
      await this.$connect();
  }
  constructor(){
    super();
  }

  async create(CreatePlanetaDto: CreatePlanetaDto) {
    try {
      const { galaxiaId, nombre } = CreatePlanetaDto;

      await verificarExistenciaGalaxia(galaxiaId);
      await verificarGalaxiaSinAsignar(galaxiaId);
      await verificarNombreUnico(nombre);

      const planeta = await this.planeta.create({
        data: {
          ...CreatePlanetaDto,
          galaxiaId: CreatePlanetaDto.galaxiaId,
        },
      });
      return new GenericSingle(planeta, HttpStatus.CREATED, 'Planeta creado de forma exitosa');

    } catch (error) {
      if (error instanceof CustomError) {
        return error;
      }
      throw new CustomError(
        'Error al crear el planeta',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      const planeta = await this.planeta.findMany({
        where: { estado: 'ACTIVO' }
      });

      if (!planeta) {
        throw new CustomError(
          'No se encontraron planetas',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }
      return new GenericArray(planeta, HttpStatus.OK, 'Planetas encontrados');

    } catch (error) {
      throw new CustomError(
        'Error al obtener planetas',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      await verificarExistenciaPlaneta(id);
      await verificarPlanetaActivo(id);
      
      const planeta = await this.planeta.findUnique({
        where: {
          id: id,
          estado: 'ACTIVO',
        },
      });

      return new GenericSingle(planeta, HttpStatus.OK, 'Planeta encontrado');

    } catch (error) {
      throw new CustomError(
        'Error al obtener el planeta',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, UpdatePlanetaDto: UpdatePlanetaDto) {
    try {
      await verificarExistenciaPlaneta(id);
      await verificarPlanetaActivo(id);

      const { galaxiaId, nombre } = UpdatePlanetaDto;
      
      if (galaxiaId) {
        await verificarExistenciaGalaxia(galaxiaId);
        await verificarGalaxiaSinAsignar(galaxiaId, id);
      }
      if (nombre) {
        await verificarNombreUnico(nombre);
      }

      const planeta = await this.planeta.update({
        where: { id: id },
        data: UpdatePlanetaDto,
      });
      return new GenericSingle(planeta, HttpStatus.OK, 'Planeta Actualizado');

    } catch (error) {
      if (error instanceof CustomError) {
        return error;
      }
      throw new CustomError(
        'Error al actualizar el planeta',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      await verificarExistenciaPlaneta(id);
      await verificarPlanetaActivo(id);

      const planeta = await this.planeta.update({
        where: { id: id, },
        data: { estado: 'INACTIVO' },
      });
      return new GenericSingle(planeta, HttpStatus.OK, 'Planeta eliminado');

    } catch (error) {
      throw new CustomError(
        'Error al eliminar planeta',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
