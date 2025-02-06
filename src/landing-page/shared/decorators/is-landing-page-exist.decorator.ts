import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { CustomError } from 'src/shared/class/Error.Class';
import { ExistenciaLandingPage } from '../validations/landing-page.validation';

export const IsLandingPageExist = createParamDecorator(
    async (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const { id } = request.params;

        try {
            await ExistenciaLandingPage(id);

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
