import { PLANETA_FACTORY } from '@constants/factories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EstadoGenerico, Prisma } from '@prisma/client';
import { PlanetaPaginationDto } from 'src/application/dto/planeta/PlanetaPagination.dto';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetaFactory } from 'src/core/fabricas/planeta/planeta.factory';
import { PlanetaRepository } from 'src/core/repositories/planeta/planeta.respository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

const galaxiaInclude = { galaxia: { select: { nombre: true } } } as const;

@Injectable()
export class PlanetaPrismaRepository implements PlanetaRepository {
  constructor(
    private prisma: PrismaService,
    @Inject(PLANETA_FACTORY)
    private readonly planetaFactory: PlanetaFactory,
  ) {}

  async findById(id: string): Promise<Planeta | null> {
    if (!id) return null;
    const data = await this.prisma.planeta.findFirst({
      where: { id },
      include: galaxiaInclude,
    });
    return data ? this.planetaFactory.crearDesdePrisma(data) : null;
  }

  async findByCodigo(codigo: string): Promise<Planeta | null> {
    const data = await this.prisma.planeta.findFirst({
      where: { codigo },
      include: galaxiaInclude,
    });
    return data ? this.planetaFactory.crearDesdePrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Planeta | null> {
    const data = await this.prisma.planeta.findFirst({
      where: { nombre },
      include: galaxiaInclude,
    });
    return data ? this.planetaFactory.crearDesdePrisma(data) : null;
  }

  async save(planeta: Planeta): Promise<Planeta> {
    const data = await this.prisma.planeta.create({
      data: {
        codigo: planeta.codigo,
        nombre: planeta.nombre,
        categoria: planeta.categoria,
        galaxia: { connect: { id: planeta.galaxiaId } },
        textura: planeta.textura,
        url: planeta.url,
        imagenResumen: planeta.imagenResumen,
        resumenCurso: planeta.resumenCurso,
        estado: planeta.estado ?? EstadoGenerico.ACTIVO,

        info: planeta.info
          ? {
              tipoRiesgo: planeta.info.tipoRiesgo,
              tamano: planeta.info.tamano,
              composicion: planeta.info.composicion,
              riesgo: planeta.info.riesgo,
              nivel: planeta.info.nivel,
              ambiente: planeta.info.ambiente,
              temperatura: planeta.info.temperatura,
              villano: planeta.info.villano,
            }
          : undefined,

        peligros: planeta.peligros?.map((p) => ({
          nombre: p.nombre,
          descripcion: p.descripcion,
          nivelRiesgo: p.nivelRiesgo,
          temperatura: p.temperatura,
          villano: p.villano,
          cta: p.cta,
        })),

        beneficios: planeta.beneficios?.map((b) => ({
          titulo: b.titulo,
          descripcion: b.descripcion,
        })),
      },
      include: galaxiaInclude,
    });

    return this.planetaFactory.crearDesdePrisma(data);
  }

  async findAllActive(
    planetaPaginationDto: PlanetaPaginationDto,
  ): Promise<Planeta[]> {
    const { page, limit, galaxiaId } = planetaPaginationDto;

    const planetas = await this.prisma.planeta.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        estado: EstadoGenerico.ACTIVO,
        ...(galaxiaId && { galaxiaId }),
      },
      include: galaxiaInclude,
      orderBy: {
        nombre: 'asc',
      },
    });

    if (!planetas || planetas.length === 0) {
      throw new NotFoundException(
        galaxiaId
          ? `No existen planetas activos en la galaxia ${galaxiaId}`
          : 'No existen planetas activos',
      );
    }

    return planetas.map((p) => this.planetaFactory.crearDesdePrisma(p));
  }

  async update(id: string, planeta: Partial<Planeta>): Promise<Planeta> {
    const updateData: Prisma.PlanetaUpdateInput = {
      nombre: planeta.nombre,
      textura: planeta.textura,
      url: planeta.url,
      imagenResumen: planeta.imagenResumen,
      resumenCurso: planeta.resumenCurso,
      estado: planeta.estado,
    };

    // Solo incluir codigo si está presente
    if (planeta.codigo !== undefined) {
      updateData.codigo = planeta.codigo;
    }

    // Manejar galaxiaId
    if (planeta.galaxiaId !== undefined) {
      updateData.galaxia = { connect: { id: planeta.galaxiaId } };
    }

    // Manejar info
    if (planeta.info !== undefined) {
      updateData.info = planeta.info === null ? null : {
        tipoRiesgo: planeta.info.tipoRiesgo,
        tamano: planeta.info.tamano,
        composicion: planeta.info.composicion,
        riesgo: planeta.info.riesgo,
        nivel: planeta.info.nivel,
        ambiente: planeta.info.ambiente,
        temperatura: planeta.info.temperatura,
        villano: planeta.info.villano,
      };
    }

    // Manejar peligros
    if (planeta.peligros !== undefined) {
      updateData.peligros = {
        set: planeta.peligros.map((p) => ({
          nombre: p.nombre,
          descripcion: p.descripcion,
          nivelRiesgo: p.nivelRiesgo,
          temperatura: p.temperatura,
          villano: p.villano,
          cta: p.cta,
        })),
      };
    }

    // Manejar beneficios
    if (planeta.beneficios !== undefined) {
      updateData.beneficios = {
        set: planeta.beneficios.map((b) => ({
          titulo: b.titulo,
          descripcion: b.descripcion,
        })),
      };
    }

    const data = await this.prisma.planeta.update({
      where: { id },
      data: updateData,
      include: galaxiaInclude,
    });

    return this.planetaFactory.crearDesdePrisma(data);
  }

  async delete(id: string, estado: EstadoGenerico): Promise<Planeta> {
    const data = await this.prisma.planeta.update({
      where: { id },
      data: { estado },
      include: galaxiaInclude,
    });
    return this.planetaFactory.crearDesdePrisma(data);
  }
}