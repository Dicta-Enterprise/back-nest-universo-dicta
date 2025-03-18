import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { PrismaClient } from '@prisma/client';
import { GenericArray, GenericSingle } from 'src/shared/class/Generic.Class';
import { CustomError } from 'src/shared/class/Error.Class';

@Injectable()
export class ProfesorService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Profesor Service');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to MongoDb');
  }

  constructor() {
    super();
  }

  async create(createProfesorDto: CreateProfesorDto) {
    try {
      
      const profesor = await this.profesor.create({
        data: {
          ...createProfesorDto,
        },
      });

      return new GenericSingle(
        profesor,
        HttpStatus.CREATED,
        'Profesor creado',
      );
      
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
      
      const profesores = await this.profesor.findMany({
        where: {estado: 'ACTIVO'},
      });

      if(!profesores){
        return new CustomError(
          'No hay Profesores Registrados',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericArray(
        profesores,
        HttpStatus.OK,
        'Profesores encontrados',
      );

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
      const profesor = await this.profesor.findUnique({
        where: {
          id: id,
          estado: 'ACTIVO',
        },
      });

      if (!profesor) {
        return new CustomError(
          'Profesor no encontrado o esta Inactivo',
          'Not Found',
          HttpStatus.NOT_FOUND,
        );
      }

      return new GenericSingle(
        profesor,
        HttpStatus.OK,
        'Profesor encontrado',
      );

    } catch (error) {
      throw new CustomError(
        null,
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateProfesorDto: UpdateProfesorDto) {
    try {
      
      const profesor = await this.profesor.update({
        where: { 
          id: id 
        },
        data: {
          ...updateProfesorDto,
        },
      });

      return new GenericSingle(
        profesor,
        HttpStatus.OK,
        'Profesor actualizado',
      );

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
      
      const profesor = await this.profesor.update({
        where: {
          id: id,
        },
        data: {
          estado: 'INACTIVO',
        },
      });

      return new GenericSingle(
        profesor,
        HttpStatus.OK,
        'Profesor Inavilitado',
      );

    } catch (error) {
      throw new CustomError(
        'Error',
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
