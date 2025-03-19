import { CallHandler, ConflictException, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Observable } from "rxjs";

const prisma = new PrismaClient();

@Injectable()
export class ValidarDuplicadosInterceptor implements NestInterceptor {
    constructor(private readonly entidad: string, private readonly atributos: string[]) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const id = request.params?.id;
        const body = request.body;

        if (!body || this.atributos.every((attr) => !body[attr])) {
            return next.handle();
        }

        const modelo: any = prisma[this.entidad];

        const whereConditions = this.atributos.map((attr) => ({
            [attr]: body[attr],
        }));

        const registroExistente = await modelo.findFirst({
            where: {
                OR: whereConditions,
                NOT: id ? { id } : undefined,
            },
        });

        if (registroExistente) {
            const duplicados = this.atributos.filter((attr) => body[attr] === registroExistente[attr]);

            const mensaje = duplicados.map((attr) => `${attr}: '${body[attr]}'`).join(', ');

            throw new ConflictException(`El ${this.entidad} con ${mensaje} ya existe.`);
        }

        return next.handle();
    }
}