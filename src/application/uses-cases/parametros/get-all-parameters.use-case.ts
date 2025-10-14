import { Injectable } from '@nestjs/common';
import { Result } from 'src/shared/domain/result/result';
import { ParameterDto } from '../../dto/parametros/parameter.dto';
import { GetAllParametersResponseDto } from '../../dto/parametros/get-all-parameters-response.dto';

import { GetAllCategoriaUseCase } from 'src/application/uses-cases/categoria/get-all-categoria.use-case';
import { GetAllGalaxiaUseCase } from 'src/application/uses-cases/galaxias/get-all-galaxia.use.case';
import { GetAllPlanetaUseCase } from 'src/application/uses-cases/planeta/get-all-planeta.use-case';
import { GalaxiaPaginationDto } from 'src/application/dto/galaxia';
import { PlanetaPaginationDto } from 'src/application/dto/planeta/PlanetaPagination.dto';


@Injectable()
export class GetAllParametersUseCase {
  constructor(
    private readonly getAllCategoriaUseCase: GetAllCategoriaUseCase,
    private readonly getAllGalaxiaUseCase: GetAllGalaxiaUseCase,
    private readonly getAllPlanetaUseCase: GetAllPlanetaUseCase,
  ) {}

  async execute(): Promise<Result<GetAllParametersResponseDto>> {
    try {
      // Creammos instacionas vacias de los DTOs de paginacion
      const galaxiaPagination = new GalaxiaPaginationDto();
      const planetaPagination = new PlanetaPaginationDto();

      const [resultCategorias, resultGalaxias, resultPlanetas] = await Promise.all([
        this.getAllCategoriaUseCase.execute(),
        this.getAllGalaxiaUseCase.execute(galaxiaPagination),
        this.getAllPlanetaUseCase.execute(planetaPagination),
      ]);

     if (resultCategorias.isFailure || resultGalaxias.isFailure || resultPlanetas.isFailure) {
      throw new Error('Error al obtener los parámetros');
    }
    // Con esto nos aseguramos que el frontend siempre reciba los datos en el formato esperado.
    const parameters: GetAllParametersResponseDto = {
      DP_CATEGORIAS: resultCategorias.getValue().map(c => ({
        id: c.id,
        value: c.nombre,
      } as ParameterDto)),
      DP_GALAXIAS: resultGalaxias.getValue().map(g => ({
        id: g.id,
        value: g.nombre,
      } as ParameterDto)),
      DP_PLANETAS: resultPlanetas.getValue().map(p => ({
        id: p.id,
        value: p.nombre,
      } as ParameterDto)),
    };

    return Result.ok(parameters);
    }
    catch (error) {
      return Result.fail(error);
    }
  }
}