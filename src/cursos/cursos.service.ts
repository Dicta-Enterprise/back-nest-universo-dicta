import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PrismaClient } from '@prisma/client';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericSingle } from 'src/shared/class/Generic.Class';

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

      return await this.curso.create({
        data: {
          ...createCursoDto,
          categoriaId: createCursoDto.categoriaId,
          planetaId: createCursoDto.planetaId,
        },
      });

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
      const cursos = await this.curso.findMany({
        where: {estado: 'ACTIVO'},
      });

      if(!cursos){
        return new CustomError(
          'No hay Cursos Registrados',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return cursos;

    } catch (error) {
      throw new CustomError(
        null,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {

      const curso = await this.curso.findUnique({
        where: {
          id: id,
          estado: 'ACTIVO',
        },
      });
  
      if (!curso) {
        return new CustomError(
          'El Curso buscado no existe o esta Inactivo',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }
  
      return curso;

    } catch (error) {
      throw new CustomError(
        null,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateCursoDto: UpdateCursoDto) {
    try {
      
      const curso = await this.curso.update({
        where: {
          id: id
        },
        data: {
          ...updateCursoDto,
        },
      });
      
      return new GenericSingle(curso, HttpStatus.OK, 'Curso actualizada');

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

      const curso = await this.curso.update({
        where: {
          id: id,
        },
        data: {
          estado: 'INACTIVO',
        },
      });

      return new GenericSingle(curso, HttpStatus.OK, 'Curso Inavilitado');

    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
