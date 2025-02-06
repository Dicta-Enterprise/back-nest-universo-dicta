import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { verificarExistenciaPlaneta, verificarPlanetaNoAsignado, verificarTituloUnico } from '../validations/landing-page.validation';
import { CustomError } from 'src/shared/class/Error.Class';

export const ValidateLandingPage = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;
    const { planetaId, titulo } = body;
    const id = request.params.id; 

    try {
      if (planetaId) {
        await verificarExistenciaPlaneta(planetaId);
        await verificarPlanetaNoAsignado(planetaId, id);
      }

      if (titulo) {
        await verificarTituloUnico(titulo);
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