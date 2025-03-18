import { ArgumentMetadata, ConflictException, ExecutionContext, Injectable, PipeTransform } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class ValidarNombreDuplicadoPipe implements PipeTransform {
  constructor(
    private readonly entidad: string,
    private readonly atributos: string[],
  ) {}

  async transform(value: any, metadata: ArgumentMetadata, context?: ExecutionContext) {
    if (!value || this.atributos.every((atributo) => !value[atributo])) {
      return value;
    }

    const modelo: any = prisma[this.entidad];

    const request = context?.switchToHttp().getRequest();
    const id = request?.params?.id || null;

    console.log('ID:', id);
    console.log('Value:', value);

    const whereConditions = this.atributos.map(atributo => ({
      [atributo]: value[atributo]
    }));

    const registroExistente = await modelo.findFirst({
      where: {
        OR: whereConditions,
        NOT: id ? { id } : undefined,
      },
    });

    if (registroExistente) {
      const duplicados = this.atributos.filter(attr => value[attr] === registroExistente[attr]);

      const mensaje = duplicados.map(attr => `${attr}: '${value[attr]}'`).join(", ");
      
      throw new ConflictException(`El ${this.entidad} con ${mensaje} ya existe.`);
    }

    return value

  }
}