import { Injectable } from '@nestjs/common';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { CategoriaRepository } from 'src/core/repositories/categoria/categoria.respository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class CategoriaPrismaRepository implements CategoriaRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Categoria | null> {
    const data = await this.prisma.categoria.findUnique({
      where: { id },
    });

    return data ? Categoria.fromPrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Categoria | null> {
    const data = await this.prisma.categoria.findUnique({
      where: { nombre },
    });

    return data ? Categoria.fromPrisma(data) : null;
  }

  async save(categoria: Categoria): Promise<Categoria> {
    const data = await this.prisma.categoria.create({
      data: {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        imagenUrl: categoria.imagenUrl,
        estado: categoria.estado,
      },
    });

    return Categoria.fromPrisma(data);
  }

  async findAllActive(): Promise<Categoria[]> {
    const categorias = await this.prisma.categoria.findMany();
    const res = Categoria.fromPrismaList(categorias);
    return res;
  }

  async update(id: string, categoria: Partial<Categoria>): Promise<Categoria> {
    const data = await this.prisma.categoria.update({
      where: { id },
      data: {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        estado: categoria.estado,
      },
    });
    return Categoria.fromPrisma(data);
  }

  async delete(id: string, estado: boolean): Promise<Categoria> {
    const data = await this.prisma.categoria.update({
      where: { id },
      data: {
        estado: estado,
      },
    });

    return Categoria.fromPrisma(data);
  }
}
