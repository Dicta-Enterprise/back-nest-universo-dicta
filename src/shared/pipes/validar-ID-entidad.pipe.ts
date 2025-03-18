import { ArgumentMetadata, BadRequestException, ConflictException, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class ValidarIDEntidadPipe implements PipeTransform {
  constructor(private readonly entidad: string) {}

  async transform(id:string, metadata: ArgumentMetadata) {

    const modelo: any = prisma[this.entidad];

    if (!modelo) {
      throw new Error(`Entidad '${this.entidad}' no encontrada en Prisma`);
    }

    const entidadEncontrada = await modelo.findUnique({
      where: { id },
    });

    if (!entidadEncontrada) {
      throw new NotFoundException(`${this.entidad} con ID ${id} no existe`);
    }

    if (entidadEncontrada.estado === 'INACTIVO') {
      throw new ConflictException(`${this.entidad} está Inactivo`);
    }
  }
}