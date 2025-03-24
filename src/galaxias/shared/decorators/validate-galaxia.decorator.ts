import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { CustomError } from 'src/shared/class/Error.Class';
import { verificarNombreUnico } from '../validations/galaxias.validation';

export const ValidateGalaxia = createParamDecorator(
    async (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const body = request.body;
        const { nombre } = body;
        const id = request.params.id;

        try {
            if (nombre) {
                await verificarNombreUnico(nombre, id);
            }

            return body;
        } catch (error) {
            if (error instanceof CustomError) {
                throw new HttpException(
                    {
                        message: error.message,
                        error: error.data,
                    },
                    error.status
                );
            }
            throw new HttpException('Error interno en la validación', 500);
        }
    },
);