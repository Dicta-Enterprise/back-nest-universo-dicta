import { CURSO_FACTORY } from '@constants/factories';
import { Inject, Injectable } from '@nestjs/common';
import { Curso } from 'src/core/entities/curso/curso.entity';
import { CursoFactory } from 'src/core/fabricas/curso/curso.factory';
import { CursoRepository } from 'src/core/repositories/curso/curso.respository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { ValidationError } from 'src/shared/domain/errors/validation.error';

@Injectable()
export class CursoPrismaRepository implements CursoRepository {
  constructor(
    private prisma: PrismaService,
    @Inject(CURSO_FACTORY)
    private readonly cursoFactory: CursoFactory,
  ) {}

  async findById(id: string): Promise<Curso | null> {
    const data = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        profesor: {
          select: {
            id: true,
            nombre: true,
            dni: false,
            apellido_materno: true,
            apellido_paterno: true,
            estado_p: false,
            email: true,
          },
        },
        categoria: {
          select: {
            id: false,
            nombre: true,
            descripcion: true,
            url: false,
            estado: false,
          },
        },
      },
    });

    return data ? this.cursoFactory.crearDesdePrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Curso | null> {
    const data = await this.prisma.curso.findUnique({
      where: { nombre },
      include: {
        profesor: {
          select: {
            id: true,
            nombre: true,
            dni: false,
            apellido_materno: true,
            apellido_paterno: true,
            estado_p: false,
            email: true,
          },
        },
        categoria: {
          select: {
            id: false,
            nombre: true,
            descripcion: true,
            url: false,
            estado: false,
          },
        },
      },
    });

    return data ? this.cursoFactory.crearDesdePrisma(data) : null;
  }

  async findAllActive(): Promise<Curso[]> {
    const data = await this.prisma.curso.findMany({
      include: {
        profesor: {
          select: {
            id: true,
            nombre: true,
            dni: false,
            apellido_materno: true,
            apellido_paterno: true,
            estado_p: false,
            email: true,
          },
        },
        categoria: {
          select: {
            id: false,
            nombre: true,
            descripcion: true,
            url: false,
            estado: false,
          },
        },
      },
    });

    return data.map((c) => this.cursoFactory.crearDesdePrisma(c));
  }

  async save(curso: Curso): Promise<Curso> {
    try {
      const data = await this.prisma.curso.create({
        data: {
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          beneficios: curso.beneficios,
          fechaInicio: curso.fechaInicio,
          fechaFinal: curso.fechaFinal,
          precio: curso.precio,
          estado: curso.estado,
          imagen: curso.imagen,
          duracionSemanas: curso.duracionSemanas,
          profesor: {
            connect: {
              id: curso.profesorId,
            },
          },
          categoria: {
            connect: {
              id: curso.categoriaId,
            },
          },
        },
        include: {
          profesor: {
            select: {
              id: true,
              nombre: true,
              dni: false,
              apellido_materno: true,
              apellido_paterno: true,
              estado_p: false,
              email: true,
            },
          },
          categoria: {
            select: {
              id: false,
              nombre: true,
              descripcion: true,
              url: false,
              estado: false,
            },
          },
        },
      });

      return this.cursoFactory.crearDesdePrisma(data);
    } catch (error) {
      const mensaje = String(error);

      if (mensaje.includes('Profesor') || mensaje.includes('CursoToProfesor')) {
        throw new ValidationError('El profesor no existe');
      }

      if (mensaje.includes('Categoria') || mensaje.includes('CursoToCategoria')) {
        throw new ValidationError('La categoría no existe');
      }

      throw new ValidationError('Error al registrar el curso');
    }
  }

  async update(id: string, curso: Partial<Curso>): Promise<Curso> {
    try {
      const dataUpdate: Record<string, unknown> = {
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        beneficios: curso.beneficios,
        fechaInicio: curso.fechaInicio,
        fechaFinal: curso.fechaFinal,
        precio: curso.precio,
        estado: curso.estado,
        imagen: curso.imagen,
        duracionSemanas: curso.duracionSemanas,
      };

      if (curso.profesorId) {
        dataUpdate.profesor = {
          connect: {
            id: curso.profesorId,
          },
        };
      }

      if (curso.categoriaId) {
        dataUpdate.categoria = {
          connect: {
            id: curso.categoriaId,
          },
        };
      }

      const data = await this.prisma.curso.update({
        where: { id },
        data: dataUpdate,
        include: {
          profesor: {
            select: {
              id: true,
              nombre: true,
              dni: false,
              apellido_materno: true,
              apellido_paterno: true,
              estado_p: false,
              email: true,
            },
          },
          categoria: {
            select: {
              id: false,
              nombre: true,
              descripcion: true,
              url: false,
              estado: false,
            },
          },
        },
      });

      return this.cursoFactory.crearDesdePrisma(data);
    } catch (error) {
      const mensaje = String(error);

      if (mensaje.includes('Profesor') || mensaje.includes('CursoToProfesor')) {
        throw new ValidationError('El profesor no existe');
      }

      if (mensaje.includes('Categoria') || mensaje.includes('CursoToCategoria')) {
        throw new ValidationError('La categoría no existe');
      }

      throw new ValidationError('Error al actualizar el curso');
    }
  }

  async delete(id: string, estado: boolean): Promise<Curso> {
    try {
      const data = await this.prisma.curso.update({
        where: { id },
        data: {
          estado,
        },
      });

      return this.cursoFactory.crearDesdePrisma(data);
    } catch {
      throw new ValidationError('El curso no existe o no se pudo eliminar');
    }
  }
}