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
import { Curso, CursoImagenes } from 'src/core/entities/curso/curso.entity';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

interface ConstructorCursoDinamico {
  new (...args: unknown[]): Curso;
}

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

    const dtoDinamico = dtoCurso as unknown as Record<string, unknown>;

    if (dtoDinamico.planetaId) {
      const planeta = await this.prisma.planeta.findUnique({
        where: { id: dtoDinamico.planetaId as string },
      });

      if (!planeta) {
        throw new BussinesRuleException(
          'El planeta no existe',
          HttpStatus.NOT_FOUND,
          {
            planetaId: dtoDinamico.planetaId as string,
            codigoError: 'PLANETA_NO_ENCONTRADO',
          },
        );
      }
    }

    const CursoInstanciable = Curso as unknown as ConstructorCursoDinamico;
    const curso = new CursoInstanciable(
      null,
      dtoCurso.nombre,
      dtoCurso.descripcion || '',
      new Date(),
      dtoCurso.fechaInicio ?? null,
      dtoCurso.fechaFinal ?? null,
      dtoCurso.precio,
      true,
      dtoCurso.imagenes as unknown as CursoImagenes, 
      dtoCurso.duracionSemanas,
      dtoCurso.profesorId,
      dtoCurso.categoriaId,
      dtoCurso.resumenDescripcion,
      dtoCurso.valoracion ?? 0,
      dtoDinamico.planetaId,
      undefined,
      dtoCurso.beneficios as unknown,
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

    const dtoDinamico = dtoCurso as unknown as Record<string, unknown>;

    if (dtoDinamico.planetaId) {
      const planeta = await this.prisma.planeta.findUnique({
        where: { id: dtoDinamico.planetaId as string },
      });

      if (!planeta) {
        throw new BussinesRuleException(
          'El planeta no existe',
          HttpStatus.NOT_FOUND,
          {
            planetaId: dtoDinamico.planetaId as string,
            codigoError: 'PLANETA_NO_ENCONTRADO',
          },
        );
      }
    }

    const CursoInstanciable = Curso as unknown as ConstructorCursoDinamico;
    const cursoBaseDinamico = existe as unknown as Record<string, unknown>;

    const curso = new CursoInstanciable(
      id,
      dtoCurso.nombre,
      dtoCurso.descripcion || '',
      existe.fechaCreacion,
      dtoCurso.fechaInicio ?? existe.fechaInicio,
      dtoCurso.fechaFinal ?? existe.fechaFinal,
      dtoCurso.precio ?? existe.precio,
      existe.estado,
      (dtoCurso.imagenes as unknown as CursoImagenes) ?? (existe.imagenes as unknown),
      dtoCurso.duracionSemanas ?? existe.duracionSemanas,
      dtoCurso.profesorId ?? existe.profesorId,
      dtoCurso.categoriaId ?? existe.categoriaId,
      dtoCurso.resumenDescripcion ?? existe.resumenDescripcion,
      dtoCurso.valoracion ?? existe.valoracion,
      dtoDinamico.planetaId ?? cursoBaseDinamico.planetaId,
      undefined,
      (dtoCurso.beneficios as unknown) ?? existe.beneficios,
    );

    return this.repository.update(id, curso);
  }

  async eliminarCurso(id: string): Promise<Curso> {
    const curso = await this.obtenerUnCurso(id);
    const estado: boolean = curso.estado === true ? false : true;
    return this.repository.delete(id, estado);
  }
}