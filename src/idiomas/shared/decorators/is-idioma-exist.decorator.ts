import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { CustomError } from 'src/shared/class/Error.Class';
import { ExistenciaIdioma } from '../validations/idiomas.validation';

export const IsIdiomaExist = createParamDecorator(
    async (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const { id } = request.params;

        try {
            await ExistenciaIdioma(id);

            return request.body;
        } catch (error) {
            if (error instanceof CustomError) {
                throw new HttpException(
                    {
                        message: error.message,
                        error: error.data,
                    },
                    error.status,
                );
            }
            throw new HttpException('Error interno en la validación', 500);
        }
    },
);
