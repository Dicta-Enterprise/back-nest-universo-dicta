import {
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { CreateCursoDto } from 'src/application/dto/curso/create-curso.dto';
import { UpdateCursoDto } from 'src/application/dto/curso/update-curso.dto';

import { CURSO_REPOSITORY } from 'src/core/constants/constants';

import { CursoRepository } from '../../repositories/curso/curso.respository';

import { ValidatorService } from 'src/shared/application/validation/validator.service';

import { Curso } from 'src/core/entities/curso/curso.entity';

import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class CursosService {
  constructor(
    @Inject(CURSO_REPOSITORY)
    private repository: CursoRepository,

    private readonly validator: ValidatorService,

    private readonly prisma: PrismaService,
  ) {}

  async crearCurso(dtoCurso: CreateCursoDto): Promise<Curso> {

    await this.validator.validate(dtoCurso, CreateCursoDto);

    const existe = await this.repository.findByName(dtoCurso.nombre);

    if (existe) {
      throw new BussinesRuleException(
        'El curso ya existe',
        HttpStatus.BAD_REQUEST,
        {
          nombre: dtoCurso.nombre,
          codigoError: 'CURSO_DUPLICADO',
        },
      );
    }

  
    if (dtoCurso.planetaId) {

      const planeta = await this.prisma.planeta.findUnique({
        where: {
          id: dtoCurso.planetaId,
        },
      });

      if (!planeta) {
        throw new BussinesRuleException(
          'El planeta no existe',
          HttpStatus.NOT_FOUND,
          {
            planetaId: dtoCurso.planetaId,
            codigoError: 'PLANETA_NO_ENCONTRADO',
          },
        );
      }
    }

    const curso = new Curso(
      null,
      dtoCurso.nombre,
      dtoCurso.descripcion || '',
      new Date(),
      dtoCurso.fechaInicio ?? null,
      dtoCurso.fechaFinal ?? null,
      dtoCurso.precio,
      true,
      dtoCurso.imagen || '',
      dtoCurso.duracionSemanas,
      dtoCurso.profesorId,
      dtoCurso.categoriaId,
      dtoCurso.resumenDescripcion,
      dtoCurso.valoracion ?? 0,
      dtoCurso.planetaId,
      undefined,
      undefined,
      undefined,
      dtoCurso.beneficios,
    );

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

  async actualizarCurso(
    id: string,
    dtoCurso: UpdateCursoDto,
  ): Promise<Curso> {

    await this.validator.validate(dtoCurso, UpdateCursoDto);

    const existe = await this.repository.findById(id);

    if (!existe) {
      throw new BussinesRuleException(
        'El curso no existe',
        HttpStatus.NOT_FOUND,
        {
          id,
          codigoError: 'CURSO_NO_ENCONTRADO',
        },
      );
    }

 
    if (dtoCurso.planetaId) {

      const planeta = await this.prisma.planeta.findUnique({
        where: {
          id: dtoCurso.planetaId,
        },
      });

      if (!planeta) {
        throw new BussinesRuleException(
          'El planeta no existe',
          HttpStatus.NOT_FOUND,
          {
            planetaId: dtoCurso.planetaId,
            codigoError: 'PLANETA_NO_ENCONTRADO',
          },
        );
      }
    }

    const curso = new Curso(
      id,
      dtoCurso.nombre,
      dtoCurso.descripcion || '',
      existe.fechaCreacion,
      dtoCurso.fechaInicio ?? existe.fechaInicio,
      dtoCurso.fechaFinal ?? existe.fechaFinal,
      dtoCurso.precio ?? existe.precio,
      existe.estado,
      dtoCurso.imagen ?? existe.imagen,
      dtoCurso.duracionSemanas ?? existe.duracionSemanas,
      dtoCurso.profesorId ?? existe.profesorId,
      dtoCurso.categoriaId ?? existe.categoriaId,
      dtoCurso.resumenDescripcion ?? existe.resumenDescripcion,
      dtoCurso.valoracion ?? existe.valoracion,
      dtoCurso.planetaId ?? existe.planetaId,
      undefined,
      undefined,
      undefined,
      dtoCurso.beneficios ?? existe.beneficios,
    );

    return this.repository.update(id, curso);
  }

  async eliminarCurso(id: string): Promise<Curso> {

    const curso = await this.obtenerUnCurso(id);

    const estado: boolean =
      curso.estado === true ? false : true;

    return this.repository.delete(id, estado);
  }
}