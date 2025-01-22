import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso, PrismaClient } from '@prisma/client';
import { CustomError } from 'src/shared/class/Error.Class';
import { GenericSingle } from 'src/shared/class/Generic.Class';
import { string } from 'joi';

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

      const categoriaExistente = await this.categoria.findUnique({
        where: {
          id: createCursoDto.categoria,
        },
      });
  
      if (!categoriaExistente) {
        return new CustomError(
          'La categoría proporcionada no existe',
          'Bad Request',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.curso.create({
        data: {
          nombre: createCursoDto.nombre,
          descripcion: createCursoDto.descripcion,
          fechaCreacion: createCursoDto.fechaCreacion,
          fechaInicio: createCursoDto.fechaInicio,
          fechaFinalizacion: createCursoDto.fechaFinalizacion,
          cantidadAlumnos: createCursoDto.cantidadAlumnos,
          precio: createCursoDto.precio,
          estado: createCursoDto.estado,
          imagen: createCursoDto.imagen,
          video: createCursoDto.video,
          duracion: createCursoDto.duracion,
          categoria:{
            connect:{
              id: createCursoDto.categoria,
            } 
          }
        },
        //data: createCursoDto,
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

      const categoriaExistente = await this.categoria.findUnique({
        where: {
          id: updateCursoDto.categoria,
        },
      });
  
      if (!categoriaExistente) {
        return new CustomError(
          'La categoría proporcionada no existe',
          'Bad Request',
          HttpStatus.BAD_REQUEST,
        );
      }

      const curso = await this.curso.update({
        where: {
          id: id
        },
        data: {
          nombre: updateCursoDto.nombre,
          descripcion: updateCursoDto.descripcion,
          fechaCreacion:  updateCursoDto.fechaCreacion,
          fechaInicio:  updateCursoDto.fechaInicio,
          fechaFinalizacion:  updateCursoDto.fechaFinalizacion,
          cantidadAlumnos: updateCursoDto.cantidadAlumnos,
          precio:  updateCursoDto.precio,
          estado:  updateCursoDto.estado,
          imagen:  updateCursoDto.imagen,
          video:  updateCursoDto.video,
          duracion:  updateCursoDto.duracion,
          categoria:{
            connect:{
              id: updateCursoDto.categoria,
            } 
          }
        },
      });

      // if(!curso){
      //   return new CustomError(
      //     'El curso buscado no existe',
      //     'Not Found',
      //     HttpStatus.NOT_FOUND,
      //   );
      // }

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
