import { IDIOMA_FACTORY } from '@constants/factories';
import { Inject, Injectable } from '@nestjs/common';
import { Idioma } from 'src/core/entities/idioma/idioma.entity';
import { IdiomaFactory } from 'src/core/fabricas/idioma/idioma.factory';
import { IdiomaRepository } from 'src/core/repositories/idioma/idioma.repostitory';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class IdiomaPrismaRepository implements IdiomaRepository {
  constructor(
    private prisma: PrismaService,
    @Inject(IDIOMA_FACTORY)
    private readonly idiomaFatory: IdiomaFactory,
  ) {}

  async findById(id: string): Promise<Idioma | null> {
    const data = await this.prisma.idioma.findUnique({
      where: { id },
    });

    return data ? this.idiomaFatory.crearDesdePrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Idioma | null> {
    const data = await this.prisma.idioma.findUnique({
      where: { nombre },
    });

    return data ? this.idiomaFatory.crearDesdePrisma(data) : null;
  }

  async findAllActive(): Promise<Idioma[]> {
    const idiomas = await this.prisma.idioma.findMany();
    return idiomas.map((i) => this.idiomaFatory.crearDesdePrisma(i));
  }

  async save(idioma: Idioma): Promise<Idioma> {
    const data = await this.prisma.idioma.create({
      data: {
        nombre: idioma.nombre,
        estado: idioma.estado,
      },
    });

    return this.idiomaFatory.crearDesdePrisma(data);
  }

  async update(id: string, idioma: Partial<Idioma>): Promise<Idioma> {
    const data = await this.prisma.idioma.update({
      where: { id },
      data: {
        nombre: idioma.nombre,
        estado: idioma.estado,
      },
    });

    return this.idiomaFatory.crearDesdePrisma(data);
  }

  async delete(id: string, estado: boolean): Promise<Idioma> {
    const data = await this.prisma.idioma.update({
      where: { id },
      data: {
        estado: estado,
      },
    });
    return this.idiomaFatory.crearDesdePrisma(data);
  }
}
