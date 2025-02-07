import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { CreateCursoDto } from "../dto/create-curso.dto";
import { UpdateCursoDto } from "../dto/update-curso.dto";

export async function validarExistenciaRelacionados(createCursoDto: CreateCursoDto | UpdateCursoDto, categoria: any, planeta: any) {
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

export async function verificarExistenciaCurso(parametros: any, curso: any) {
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