import { Inject, Injectable } from '@nestjs/common';
import { PARAMETER_REGISTRY, ParameterRegistryConfig } from '../../constants/parameter-registry.config';
import { IParametrosRepository } from '../../repositories/parametros/parametros.repository';
import { PrismaEntity } from '../../types/prisma-types';

@Injectable()
export class ParametrosService {
  constructor(
    @Inject(IParametrosRepository)
    private readonly parametrosRepository: IParametrosRepository
  ) {}

  async obtenerTodosLosParametros(): Promise<Record<string, PrismaEntity[]>> {
    // Recorremos el array de configuración desde parameter-registry.config.ts que esta en '../../constants/parameter-registry.config'
    const promises = PARAMETER_REGISTRY.map((config) =>
      this.obtenerParametrosPorColeccion(config)
    );

    // Ejecutamos todas las peticiones en paralelo
    const results = await Promise.all(promises);

    // Construimos el objeto final de forma dinámica
    const parametros = PARAMETER_REGISTRY.reduce((acc, config, index) => {
      acc[config.key] = results[index];
      return acc;
    }, {} as Record<string, PrismaEntity[]>);

    return parametros;
  }

  // Este metodo toma UNA configuración del registry y consulta esa colección específica en la base de datos
  private async obtenerParametrosPorColeccion(
    config: ParameterRegistryConfig
  ): Promise<PrismaEntity[]> {
    const { collection, filter = {}, fields = ['id', 'nombre'] } = config;

    // Delegamos la obtención de datos al Repository
    // Esto respeta el Repository Pattern y mantiene la separación de capas
    return await this.parametrosRepository.findManyFromCollection(
      collection,
      filter,
      fields
    );
  }
}
