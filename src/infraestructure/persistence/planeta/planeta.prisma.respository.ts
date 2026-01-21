import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoGenerico } from '@prisma/client';
import { PlanetaPaginationDto } from 'src/application/dto/planeta/PlanetaPagination.dto';
import { Planeta } from 'src/core/entities/planeta/planeta.entity';
import { PlanetaRepository } from 'src/core/repositories/planeta/planeta.respository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class PlanetaPrismaRepository implements PlanetaRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Planeta | null> {
    const data = await this.prisma.planeta.findUnique({
      where: { id },
    });
    return data ? Planeta.fromPrisma(data) : null;
  }

  async findByName(nombre: string): Promise<Planeta | null> {
    const data = await this.prisma.planeta.findUnique({
      where: { nombre },
    });
    return data ? Planeta.fromPrisma(data) : null;
  }

  async save(planeta: Planeta): Promise<Planeta> {
    const data = await this.prisma.planeta.create({
      data: {
        grupo: planeta.grupo,
        nombre: planeta.nombre,
        tema: planeta.tema,
        galaxia: { connect: { id: planeta.galaxiaId } },
        textura: planeta.textura,
        url: planeta.url,
        imagenResumen: planeta.imagenResumen,
        imagenBeneficios: planeta.imagenBeneficios,
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
    });

    return Planeta.fromPrisma(data);
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
        ...(galaxiaId && { galaxiaId: galaxiaId }),
      },
    });
    if(!planetas || planetas.length === 0){
      throw new NotFoundException(
        galaxiaId
          ? `No existen planetas activos en la galaxia ${galaxiaId}`
          : 'No existen planetas activos',
      );
    }
    return Planeta.fromPrismaList(planetas);
  }

  async update(id: string, planeta: Partial<Planeta>): Promise<Planeta> {
    const data = await this.prisma.planeta.update({
      where: { id },
      data: {
        grupo: planeta.grupo,
        nombre: planeta.nombre,
        tema: planeta.tema,
        galaxiaId: planeta.galaxiaId,
        textura: planeta.textura,
        url: planeta.url,
        imagenResumen: planeta.imagenResumen,
        imagenBeneficios: planeta.imagenBeneficios,
        resumenCurso: planeta.resumenCurso,
        estado: planeta.estado,

        info:
          planeta.info === undefined
            ? undefined
            : planeta.info === null
              ? null
              : {
                  tipoRiesgo: planeta.info.tipoRiesgo,
                  tamano: planeta.info.tamano,
                  composicion: planeta.info.composicion,
                  riesgo: planeta.info.riesgo,
                  nivel: planeta.info.nivel,
                  ambiente: planeta.info.ambiente,
                  temperatura: planeta.info.temperatura,
                  villano: planeta.info.villano,
                },

        peligros:
          planeta.peligros === undefined
            ? undefined
            : {
                set: planeta.peligros.map((p) => ({
                  nombre: p.nombre,
                  descripcion: p.descripcion,
                  nivelRiesgo: p.nivelRiesgo,
                  temperatura: p.temperatura,
                  villano: p.villano,
                  cta: p.cta,
                })),
              },

        beneficios:
          planeta.beneficios === undefined
            ? undefined
            : {
                set: planeta.beneficios.map((b) => ({
                  titulo: b.titulo,
                  descripcion: b.descripcion,
                })),
              },
      },
    });

    return Planeta.fromPrisma(data);
  }

  async delete(id: string, estado: EstadoGenerico): Promise<Planeta> {
    const data = await this.prisma.planeta.update({
      where: { id },
      data: { estado },
    });
    return Planeta.fromPrisma(data);
  }
}
