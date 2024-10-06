import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CursosService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

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
      this.logger.error(error);
    }
  }

  async findAll() {
    try {
      const cursos = await this.curso.findMany();
      return cursos;
    } catch (error) {
      this.logger.error(error);
    }
    return `Hola`;
  }

  findOne(id: number) {
    return `This action returns a #${id} curso`;
  }

  update(id: number, updateCursoDto: UpdateCursoDto) {
    return `This action updates a #${id} curso`;
  }

  remove(id: number) {
    return `This action removes a #${id} curso`;
  }
}
