import {ConflictException } from "@nestjs/common";

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