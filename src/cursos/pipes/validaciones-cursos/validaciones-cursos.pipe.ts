import { BadRequestException, ConflictException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCursoDto } from 'src/cursos/dto/create-curso.dto';
import { UpdateCursoDto } from 'src/cursos/dto/update-curso.dto';

@Injectable()
export class ValidacionesCursosPipe extends PrismaClient implements PipeTransform  {
  
  async transform(value: CreateCursoDto | UpdateCursoDto) {

    await this.validarExistenciaRelacionados(value, this.categoria, this.planeta);
    await this.validarRangoFechas(value.fechaInicio, value.fechaFinalizacion);
    await this.verificarExistenciaCurso(value, this.curso);

    return value;
  }

  private async validarExistenciaRelacionados(createCursoDto: CreateCursoDto | UpdateCursoDto, categoria: any, planeta: any) {
    const relaciones = [
      { model: categoria, id: createCursoDto.categoriaId, message: 'La Categoría proporcionada no existe' },
      { model: planeta, id: createCursoDto.planetaId, message: 'El Planeta proporcionado no existe' },
    ];

    for (const { model, id, message } of relaciones) {
      
      if (!id) continue;

      const entidadExistente = await model.findUnique({
        where: { id },
      });

      if (!entidadExistente) {
        throw new NotFoundException(message);
      }
    }
  }

  private async validarRangoFechas(fechaInicio: Date, fechaFinalizacion: Date) {
    if (fechaFinalizacion < fechaInicio) {
      throw new BadRequestException('La fecha de finalización debe ser posterior a la fecha de inicio');
    }
  }

  private async verificarExistenciaCurso(parametros: any, curso: any) {
    const { id, nombre, estado } = parametros;

    const cursofind = await curso.findFirst({
      where: {
        AND: [
          id ? { id } : {},
          estado ? { estado } : {},
        ],
      },
    });

    if (!cursofind) {
      throw new ConflictException('El Curso buscado no existe o está Inactivo');
    }

    if (nombre) {
      const cursoNombre = await curso.findFirst({
        where: { nombre },
      });

      if (cursoNombre) {
        throw new ConflictException(`El Curso con este nombre (${cursoNombre.nombre}) ya existe. ID: ${cursoNombre.id}`);
      }
    }
  }
}



