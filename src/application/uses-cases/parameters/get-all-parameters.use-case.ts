import { Injectable } from '@nestjs/common';
import { Result } from 'src/shared/domain/result/result';
import { ParametersResponseDto } from 'src/application/dto/parameters/parameters-response.dto';
import { ParametersService } from 'src/core/services/parameters/parameters.service';

@Injectable()
export class GetAllParametersUseCase {
  constructor(
    private readonly parametersService: ParametersService,
  ) {}

  async execute(): Promise<Result<ParametersResponseDto>> {
    try {
      const response = new ParametersResponseDto();

      response.DP_CATEGORIAS = await this.parametersService.getCategorias();

      response.DP_GALAXIAS = await this.parametersService.getGalaxias();

      response.DP_PLANETAS = await this.parametersService.getPlanetas();

      response.DP_IDIOMAS = await this.parametersService.getIdiomas();

      response.DP_PROFESORES = await this.parametersService.getProfesores();

      return Result.ok(response);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
