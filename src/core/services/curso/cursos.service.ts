import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { CreateCursoDto } from 'src/application/dto/curso/create-curso.dto';
import { UpdateCursoDto } from 'src/application/dto/curso/update-curso.dto';
import { CustomError } from 'src/shared/class/Error.Class';

@Injectable()
export class CursosService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Cursos Service');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to MongoDb');
  }

  constructor() {
    super();
  }

  async create(createCursoDto: CreateCursoDto) {
    try {
      const curso = await this.curso.create({
        data: {
          nombre: createCursoDto.nombre,
          descripcion: createCursoDto.descripcion,
          fechaCreacion: createCursoDto.fechaCreacion,
          fechaInicio: createCursoDto.fechaInicio,
          fechaFinalizacion: createCursoDto.fechaFinalizacion,
          cantidadAlumnos: createCursoDto.cantidadAlumnos,
          precio: createCursoDto.precio,
          profesor: {
            connect: {
              id: createCursoDto.profesor,
            },
          },
          estado: createCursoDto.estado,
          imagen: createCursoDto.imagen,
          video: createCursoDto.video,
          duracion: createCursoDto.duracion,
          categoria: {
            connect: {
              id: createCursoDto.categoria,
            },
          },
          idioma: {
            connect: {
              id: createCursoDto.idioma,
            },
          },
          planetas: {
            connect: {
              id: createCursoDto.planetas,
            },
          },
        },
      });

      return curso;
    } catch (error) {
      throw new CustomError(
        null,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const cursos = await this.curso.findMany();
      return cursos;
    } catch (error) {
      throw new CustomError(
        null,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} curso`;
  }

  update(id: string, updateCursoDto: UpdateCursoDto) {
    console.log(updateCursoDto);
    return `This action updates a #${id} curso`;
  }

  remove(id: string) {
    return `This action removes a #${id} curso`;
  }
}
