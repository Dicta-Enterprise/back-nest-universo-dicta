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
    
      const cursofindN = await verificarExistenciaCurso({ nombre: createCursoDto.nombre }, this.curso);
      if (cursofindN) return cursofindN;

      const error = await validarExistenciaRelacionados(createCursoDto, this.categoria, this.planeta);
      if (error) return error;

      const errorFechas = await validarRangoFechas(createCursoDto.fechaInicio, createCursoDto.fechaFinalizacion);
      if (errorFechas) return errorFechas;

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
      
      const error = await validarExistenciaRelacionados(updateCursoDto, this.categoria, this.planeta);
      if (error) return error;
      
      if(updateCursoDto.fechaInicio && updateCursoDto.fechaFinalizacion){
        const errorFechas = await validarRangoFechas(updateCursoDto.fechaInicio, updateCursoDto.fechaFinalizacion);
        if (errorFechas) return errorFechas;
      }

      const cursofind = await verificarExistenciaCurso({ id, estado: 'ACTIVO' }, this.curso);
      if (cursofind) return cursofind;

      if (updateCursoDto.nombre) {
        const cursofindN = await verificarExistenciaCurso({ nombre: updateCursoDto.nombre }, this.curso);
        if (cursofindN) return cursofindN;
      }

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

      const cursofind = await verificarExistenciaCurso({ id, estado: 'ACTIVO' }, this.curso);
      if (cursofind) return cursofind;
      
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
    { model: categoria, id: createCursoDto.categoriaId, message: 'La Categoría proporcionada no existe' },
    { model: planeta, id: createCursoDto.planetaId, message: 'El Planeta proporcionado no existe' },
  ];

  for (const { model, id, message } of relaciones) {
    const entidadExistente = await model.findUnique({
      where: { id },
    });

    if (!entidadExistente) {
      return new CustomError(message, 'Not Found', HttpStatus.NOT_FOUND);
    }
  }

  return null;
}

async function validarRangoFechas(fechaInicio: Date, fechaFinalizacion: Date) {
  if (fechaFinalizacion < fechaInicio) {
    return new CustomError(
      'La fecha de finalización debe ser posterior a la fecha de inicio',
      'Bad Request',
      HttpStatus.BAD_REQUEST,
    );
  }
}

async function verificarExistenciaCurso(parametros: any, curso: any) {
  const { id, nombre, estado} = parametros;

  const cursofind = await curso.findFirst({
    where: {
      AND: [
        id ? { id } : {},
        estado ? { estado } : {},
      ],
    },
  });

  if (!cursofind) {
    return new CustomError(
      'El Curso buscado no existe o esta Inactivo',
      'Conflict',
      HttpStatus.CONFLICT,
    );
  }

  if (nombre) {
    const cursoNombre = await curso.findFirst({
      where: { nombre },
    });

    if (cursoNombre) {
      return new CustomError(
        `El Curso con este nombre (${cursoNombre.nombre}) ya existe. ID: ${cursoNombre.id}`,
        'Conflict',
        HttpStatus.CONFLICT,
      );
    }
  }
  return null;
}

