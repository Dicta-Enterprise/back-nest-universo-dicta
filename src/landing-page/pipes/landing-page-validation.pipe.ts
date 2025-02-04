import { HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { verificarExistenciaPlaneta, verificarPlanetaNoAsignado, verificarTituloUnico } from '../validations/landing-page.validation';
import { CustomError } from 'src/shared/class/Error.Class';

@Injectable()
export class LandingPageValidationPipe implements PipeTransform {
    async transform(value: any) {
        const { planetaId, titulo, id } = value;

        try {

            await verificarExistenciaPlaneta(planetaId);
            await verificarPlanetaNoAsignado(planetaId, id);
            await verificarTituloUnico(titulo);

            return value;
        }
        catch (error) {
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
    }
}