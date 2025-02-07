import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCursoDto } from 'src/cursos/dto/create-curso.dto';
import { UpdateCursoDto } from 'src/cursos/dto/update-curso.dto';
import { validarExistenciaRelacionados, verificarExistenciaCurso } from '../validations/validaciones-cursos';

@Injectable()
export class ValidacionesCursosPipe extends PrismaClient implements PipeTransform  {
  
  async transform(value: CreateCursoDto | UpdateCursoDto) {

    await validarExistenciaRelacionados(value, this.categoria, this.planeta);
    await verificarExistenciaCurso(value, this.curso);

    return value;
  }

}
