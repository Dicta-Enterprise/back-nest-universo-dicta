import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { verificarExistenciaPlaneta, verificarPlanetaNoAsignado, verificarTituloUnico } from '../validations/landing-page.validation';
import { CustomError } from 'src/shared/class/Error.Class';

export const ValidateLandingPage = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    // Obtener la solicitud HTTP y su contenido
    const request = ctx.switchToHttp().getRequest(); 
    const body = request.body; // Datos enviados en el cuerpo de la petición
    const { planetaId, titulo } = body; // Extraer planetaId y título del cuerpo
    const id = request.params.id; // Obtener el ID de la landing page si está presente en la URL

    // Metodos ubicados en shared > validations > landing-page.validation.ts
    try {
      if (planetaId) {
        await verificarExistenciaPlaneta(planetaId);
        await verificarPlanetaNoAsignado(planetaId, id);
      }

      if (titulo) {
        await verificarTituloUnico(titulo, id);
      }

      return body;
    } catch (error) {
      // Si el error es una instancia de CustomError, lanzar una excepción HTTP con su información
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