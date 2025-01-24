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
      
      console.log(createCursoDto);

      const oneCurso = await this.curso.findUnique({
        where:{
          nombre: createCursoDto.nombre
        }
      })

      if(oneCurso){
        return new CustomError(
          'El curso con este nombre ya existe',
          'Bab Request',
          HttpStatus.BAD_REQUEST,
        );
      }

      const error = await validarExistenciaRelacionados(createCursoDto, this.categoria, this.planeta);
      if (error) return error;

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
      return await this.curso.findMany();
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
        where:{
          id:id,
          estado: 'ACTIVO',
        }
      });

      if(!curso){
        return new CustomError(
          'El curso buscado no existe',
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
      
      // const cursofind = await this.curso.findUnique({
      //   where:{
      //     id:id,
      //     estado: 'ACTIVO',
      //   }
      // });

      // if(!cursofind){
      //   return new CustomError(
      //     'El curso buscado no existe',
      //     'Not Found',
      //     HttpStatus.NOT_FOUND,
      //   );
      // }

      const error = await validarExistenciaRelacionados(updateCursoDto, this.categoria, this.planeta);
      if (error) return error;

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

async function validarExistenciaRelacionados(createCursoDto: CreateCursoDto | UpdateCursoDto, categoria: any, planeta: any) {
  const relaciones = [
    { model: categoria, id: createCursoDto.categoriaId, message: 'La categoría proporcionada no existe' },
    { model: planeta, id: createCursoDto.planetaId, message: 'El planeta proporcionado no existe' },
  ];

  for (const { model, id, message } of relaciones) {
    const entidadExistente = await model.findUnique({
      where: { id },
    });

    if (!entidadExistente) {
      return new CustomError(message, 'Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  return null;
}
