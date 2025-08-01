import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { CreateCursoDto } from 'src/application/dto/curso/create-curso.dto';
import { UpdateCursoDto } from 'src/application/dto/curso/update-curso.dto';
import { CURSO_REPOSITORY } from 'src/core/constants/constants';
import { CustomError } from 'src/shared/class/Error.Class';
import { CursoRepository } from '../../repositories/curso/curso.respository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { Curso } from 'src/core/entities/curso/curso.entity';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import * as dto from 'src/application/dto/curso';

@Injectable()
export class CursosService{

  constructor(
    @Inject(CURSO_REPOSITORY)
    private repository: CursoRepository,
    private readonly validator: ValidatorService,
    ) {}

  async crearCurso(dtoCurso: CreateCursoDto): Promise<Curso>{

    await this.validator.validate(dtoCurso, CreateCursoDto);

    const existe = await this.repository.findByName(dtoCurso.nombre);

    if(existe){
      throw new BussinesRuleException(
        'El curso ya existe',
        HttpStatus.BAD_REQUEST,
        {
          nombre: dtoCurso.nombre,
          codigoError: 'CURSO_DUPLICADO',
        }
      );
    }

    const curso = new Curso(
      null,
      dtoCurso.nombre,
      dtoCurso.descripcion || '',
      new Date(),
      new Date() || null,
      new Date() || null,
      dtoCurso.precio,
      true,
      dtoCurso.imagen || '',
      dtoCurso.duracionSemanas,
      dtoCurso.profesorId,
      dtoCurso.categoriaId,
    )

    return this.repository.save(curso);
  }

  async listarCursos(): Promise<Curso[]> {

    return this.repository.findAllActive();
  }

  async obtenerUnCurso(id: string): Promise<Curso> {
    const existe = await this.repository.findById(id);

    if (!existe) {
      throw new BussinesRuleException(
        'El curso no existe',
        HttpStatus.NOT_FOUND,
        {
          id: id,
          codigoError: 'CURSO_NO_ENCONTRADO',
        },
      );
    }

    return existe;
  }

  async actualizarCurso(id: string, dtoCurso: UpdateCursoDto): Promise<Curso> {
    await this.validator.validate(dtoCurso, UpdateCursoDto);

    const curso = new Curso(
      null,
      dtoCurso.nombre,
      dtoCurso.descripcion || '',
      new Date(),
      new Date() || null,
      new Date() || null,
      dtoCurso.precio,
      true,
      dtoCurso.imagen,
      dtoCurso.duracionSemanas,
      dtoCurso.profesorId,
      dtoCurso.categoriaId,
    )

    return this.repository.update(id, curso);

  }

  async eliminarCurso(id: string): Promise<Curso> {
    const curso = await this.obtenerUnCurso(id);

    const estado: boolean = curso.estado === true ? false : true; 

    return this.repository.delete(id, estado);
  }
}
