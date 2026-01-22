import { CATEGORIA_FACTORY } from '@constants/factories';
import { Inject, Injectable } from '@nestjs/common';
import { Categoria } from 'src/core/entities/categoria/categoria.entity';
import { CategoriaFactory } from 'src/core/fabricas/categoria/categoria.factory';
import { CategoriaRepository } from 'src/core/repositories/categoria/categoria.respository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class CategoriaPrismaRepository implements CategoriaRepository {
  constructor(
    private prisma: PrismaService,
    @Inject(CATEGORIA_FACTORY)
    private readonly categoriaFactory: CategoriaFactory,
  ) {}

  async findById(id: string): Promise<Categoria | null> {
    const data = await this.prisma.categoria.findUnique({
      where: { id },
    });

    return data ? this.categoriaFactory.crearDesdePrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Categoria | null> {
    const data = await this.prisma.categoria.findUnique({
      where: { nombre },
    });

    return data ? this.categoriaFactory.crearDesdePrisma(data) : null;
  }

  async save(categoria: Categoria): Promise<Categoria> {
    const data = await this.prisma.categoria.create({
      data: {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        estado: categoria.estado,
        x: categoria.x,
        y: categoria.y,
        z: categoria.z,
        url: categoria.url,
        modelo: categoria.modelo,
      },
    });

    return this.categoriaFactory.crearDesdePrisma(data);
  }

  async findAllActive(): Promise<Categoria[]> {
    const categorias = await this.prisma.categoria.findMany({
      where: { estado: true },
    });
    return categorias.map((p) => this.categoriaFactory.crearDesdePrisma(p));
  }

  async countActive(): Promise<number> {
    const count = await this.prisma.categoria.count({
      where: { estado: true },
    });
    return count;
  }

  async update(id: string, categoria: Partial<Categoria>): Promise<Categoria> {
    const data = await this.prisma.categoria.update({
      where: { id },
      data: {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        estado: categoria.estado,
        x: categoria.x,
        y: categoria.y,
        z: categoria.z,
        url: categoria.url,
        modelo: categoria.modelo,
      },
    });
    return this.categoriaFactory.crearDesdePrisma(data);
  }

  async delete(id: string, estado: boolean): Promise<Categoria> {
    const data = await this.prisma.categoria.update({
      where: { id },
      data: { estado },
    });

    return this.categoriaFactory.crearDesdePrisma(data);
  }
}
