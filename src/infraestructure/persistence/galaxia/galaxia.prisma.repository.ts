import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { Galaxia } from 'src/core/entities/galaxia/galaxia.entity';
import { GalaxiaRepository } from 'src/core/repositories/galaxia/galaxia.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class GalaxiaPrismaRepository implements GalaxiaRepository {
  constructor(private prisma: PrismaService) {}

async save(galaxia: Galaxia): Promise<Galaxia> {
  console.log("=== INICIO SAVE REPOSITORY ===");
  console.log("GALAXIA COMPLETA:", JSON.stringify(galaxia, null, 2));

  console.log("ANÁLISIS DE ATRIBUTOS:");
  console.log("- galaxia.atributos existe:", !!galaxia.atributos);
  console.log("- galaxia.atributos es array:", Array.isArray(galaxia.atributos));
  console.log("- cantidad de atributos:", galaxia.atributos?.length || 0);

  if (galaxia.atributos && galaxia.atributos.length > 0) {
    console.log("DETALLE DE CADA ATRIBUTO:");
    galaxia.atributos.forEach((attr, index) => {
      console.log(`Atributo ${index}:`, {
        id: attr.id,
        galaxiaId: attr.galaxiaId,
        tienePosicion: !!attr.posicion,
        posicion: attr.posicion ? { x: attr.posicion.x, y: attr.posicion.y} : null,
        tieneColores: !!attr.colores,
        cantidadColores: attr.colores?.length || 0,
        colores: attr.colores?.map(c => ({ type: c.type, value: c.value })) || [],
      });
    });
  } else {
    console.log("❌ NO HAY ATRIBUTOS PARA PROCESAR");
  }

  try {
    console.log("=== EJECUTANDO PRISMA CREATE ===");

    const createData: Prisma.GalaxiaCreateInput = {
      nombre: galaxia.nombre,
      descripcion: galaxia.descripcion,
      imagen: galaxia.imagen,
      url: galaxia.url,
      textura: galaxia.textura,
      estado: galaxia.estado ?? true,
      fechaCreacion: galaxia.fechaCreacion ?? new Date(),
      fechaActualizacion: galaxia.fechaActualizacion ?? new Date(),
      categoria: {
        connect: { id: galaxia.categoriaId },
      },
      atributos: galaxia.atributos && galaxia.atributos.length > 0
        ? {
            create: galaxia.atributos.map((atributo, index) => {
              console.log(`Procesando atributo ${index} para Prisma:`);

              const itemData: Prisma.ItemCreateWithoutGalaxiaInput = {};

              if (atributo.posicion) {
                console.log(`  - Agregando posición: x=${atributo.posicion.x}, y=${atributo.posicion.y}`);
                itemData.posicion = {
                  create: {
                    x: atributo.posicion.x,
                    y: atributo.posicion.y,
                  },
                };
              } else {
                console.log(`  - Sin posición`);
              }

              if (atributo.colores && atributo.colores.length > 0) {
                console.log(`  - Agregando ${atributo.colores.length} colores`);
                itemData.colores = {
                  create: atributo.colores.map((color, colorIndex) => {
                    console.log(`    Color ${colorIndex}: type="${color.type}", value="${color.value}"`);
                    return {
                      type: color.type,
                      value: color.value,
                    };
                  }),
                };
              } else {
                console.log(`  - Sin colores`);
              }

              console.log(`  - ItemData final:`, JSON.stringify(itemData, null, 2));
              return itemData;
            }),
          }
        : undefined,
    };

    console.log("DATOS FINALES PARA PRISMA:", JSON.stringify(createData, null, 2));

    const data = await this.prisma.galaxia.create({
      data: createData,
      include: {
        categoria: true,
        atributos: {
          include: {
            posicion: true,
            colores: true,
          },
        },
      },
    });

    console.log("=== RESULTADO DE PRISMA CREATE ===");
    console.log("ID creado:", data.id);
    console.log("Nombre:", data.nombre);
    console.log("Atributos en respuesta:", data.atributos?.length || 0);

    if (data.atributos && data.atributos.length > 0) {
      console.log("ATRIBUTOS GUARDADOS EN BD:");
      data.atributos.forEach((attr, index) => {
        console.log(`Atributo ${index} guardado:`, {
          id: attr.id,
          galaxiaId: attr.galaxiaId,
          posicion: attr.posicion,
          colores: attr.colores?.length || 0,
          coloresDetalle: attr.colores,
        });
      });
    } else {
      console.log("❌ NO SE GUARDARON ATRIBUTOS EN LA BD");
    }

    console.log("RESPUESTA COMPLETA DE PRISMA:", JSON.stringify(data, null, 2));
    console.log("=== INICIANDO MAPEO GALAXIA.fromPrisma ===");

    if (typeof Galaxia.fromPrisma !== 'function') {
      console.error("❌ GALAXIA NO TIENE EL MÉTODO fromPrisma");
      throw new Error("Galaxia.fromPrisma is not a function");
    }

    console.log("✅ Galaxia.fromPrisma existe, ejecutando...");
    const result = Galaxia.fromPrisma(data);

    console.log("=== MAPEO COMPLETADO ===");
    console.log("Resultado final:", JSON.stringify(result, null, 2));
    console.log("Atributos en resultado:", result.atributos?.length || 0);

    return result;

  } catch (error) {
    console.error("=== ERROR EN SAVE ===");
    console.error("Tipo de error:", error.constructor.name);
    console.error("Mensaje:", error.message);
    console.error("Stack completo:", error.stack);

    if ((error as any).code) {
      console.error("Código de error Prisma:", (error as any).code);
      console.error("Meta:", (error as any).meta);
    }

    throw error;
  }
}


  
async findAllActive(): Promise<Galaxia[]> {
  const galaxias = await this.prisma.galaxia.findMany({
    where: {
      estado: true,
    },
    include: {
      categoria: true,
      atributos: {
        include: {
          posicion: true,
          colores: true,
        },
      },
    },
    orderBy: {
      fechaCreacion: 'desc',
    },
  });

  return Galaxia.fromPrismaList(galaxias);
}

async findById(id: string): Promise<Galaxia | null> {
  const data = await this.prisma.galaxia.findUnique({
    where: { id },
    include: {
      categoria: true,
      atributos: {
        include: {
          posicion: true,
          colores: true,
        },
      },
    },
  });

  return data ? Galaxia.fromPrisma(data) : null;
}

  async findByName(nombre: string): Promise<Galaxia | null> {
    const data = await this.prisma.galaxia.findFirst({
      where: { nombre },
    });

    return data ? Galaxia.fromPrisma(data) : null;
  }

async update(id: string, galaxia: Partial<Galaxia>): Promise<Galaxia> {
  const data = await this.prisma.galaxia.update({
    where: { id },
    data: {
      nombre: galaxia.nombre,
      descripcion: galaxia.descripcion,
      imagen: galaxia.imagen,
      url: galaxia.url,
      textura: galaxia.textura,
      estado: galaxia.estado,
      fechaCreacion: galaxia.fechaCreacion,
      fechaActualizacion: galaxia.fechaActualizacion ?? new Date(),
      ...(galaxia.categoriaId && {
        categoria: { connect: { id: galaxia.categoriaId } },
      }),
    },
    include: {
      categoria: true,
      atributos: {
        include: {
          posicion: true,
          colores: true,
        },
      },
    },
  });

  return Galaxia.fromPrisma(data);
}

async delete(id: string, estado: boolean): Promise<Galaxia> {
  const data = await this.prisma.galaxia.update({
    where: { id },
    data: {
      estado,
      fechaActualizacion: new Date(),
    },
    include: {
      categoria: true,
      atributos: {
        include: {
          posicion: true,
          colores: true,
        },
      },
    },
  });

  return Galaxia.fromPrisma(data);
}
async findByNombreYCategoria(nombre: string, categoriaId: string): Promise<Galaxia | null> {
  const galaxia = await this.prisma.galaxia.findFirst({
    where: {
      nombre,
      categoriaId,
    },
    include: {
      categoria: true,
      atributos: {
        include: {
          posicion: true,
          colores: true,
        },
      },
    },
  });

  return galaxia ? Galaxia.fromPrisma(galaxia) : null;
}

}
