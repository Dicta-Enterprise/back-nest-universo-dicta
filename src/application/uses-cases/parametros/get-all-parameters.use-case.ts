import { Injectable } from '@nestjs/common';
import { Result } from 'src/shared/domain/result/result';
import { Parameter } from '../../../core/entities/parametros/parameter.entity';
import { ParametrosService } from '../../../core/services/parametros/parametros.service';

@Injectable()
export class GetAllParametersUseCase {
  constructor(private readonly parametrosService: ParametrosService) {}

  async execute(): Promise<Result<Record<string, Parameter[]>>> {
    try {
      // 1. Obtenemos todos los parametros desde el servicio
      // El servicio recorre PARAMETER_REGISTRY y hace las consultas dinámicamente
      const parametrosRaw = await this.parametrosService.obtenerTodosLosParametros();

      // 2. Mapear cada parámetro usando el método estático de la clase Parameter
      // Los datos siempre tienen 'nombre' porque está configurado en PARAMETER_REGISTRY
      const parameters: Record<string, Parameter[]> = Object.keys(parametrosRaw).reduce(
        (acc, key) => {
          const entities = parametrosRaw[key] as Array<{ id: string; nombre: string; [key: string]: unknown }>;
          acc[key] = Parameter.fromList(entities);
          return acc;
        },
        {} as Record<string, Parameter[]>
      );

      return Result.ok(parameters);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
