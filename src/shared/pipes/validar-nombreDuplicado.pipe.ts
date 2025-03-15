import { ArgumentMetadata, ConflictException, Injectable, PipeTransform } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class ValidarNombreDuplicadoPipe implements PipeTransform {
  constructor(private readonly entidad: string) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value.nombre) {
      return value;
    }

    const modelo: any = prisma[this.entidad];

    const nombreExistente = await modelo.findFirst({
      where: {
        nombre: value.nombre,
        id: { not: value.id },
      },
    });

    if (nombreExistente) {
      throw new ConflictException(`${this.entidad} con este nombre ${nombreExistente.nombre} ya existe. ID: ${nombreExistente.id}`);
    }

    return value;
  }
}