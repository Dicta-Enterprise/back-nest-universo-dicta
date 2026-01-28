import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ParametersService } from '../../../core/services/parameters/parameters.service';
import { ParametersResponseDto } from 'src/application/dto/parameters/parameters-response.dto';
import { ParameterItemDto } from 'src/application/dto/parameters/parameter-item.dto';

@ApiTags('Parámetros')
@Controller('parameters')
export class ParametersController {
  constructor(
    private readonly parametersService: ParametersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener TODOS los parámetros del sistema' })
  @ApiResponse({ status: 200 })
  getAll() {
    return this.handleGet();
  }

  @Get(':type')
  @ApiOperation({ summary: 'Obtener parámetros por tipo' })
  @ApiParam({
    name: 'type',
    description:
      'DP_CATEGORIAS | DP_GALAXIAS | DP_PLANETAS | DP_IDIOMAS | DP_PROFESORES',
    example: 'DP_CATEGORIAS',
  })
  @ApiResponse({ status: 200 })
  getByType(@Param('type') type: string) {
    return this.handleGet(type);
  }

  private async handleGet(type?: string): Promise<{
    status: string;
    message: string;
    data: ParametersResponseDto | ParameterItemDto[];
  }> {
    if (!type) {
      const data = await this.parametersService.getAll();
      return {
        status: 'success',
        message: 'Parámetros obtenidos correctamente',
        data,
      };
    }

    switch (type.toUpperCase()) {
      case 'DP_CATEGORIAS':
        return {
          status: 'success',
          message: 'Categorías obtenidas correctamente',
          data: await this.parametersService.getCategorias(),
        };

      case 'DP_GALAXIAS':
        return {
          status: 'success',
          message: 'Galaxias obtenidas correctamente',
          data: await this.parametersService.getGalaxias(),
        };

      case 'DP_PLANETAS':
        return {
          status: 'success',
          message: 'Planetas obtenidos correctamente',
          data: await this.parametersService.getPlanetas(),
        };

      case 'DP_IDIOMAS':
        return {
          status: 'success',
          message: 'Idiomas obtenidos correctamente',
          data: await this.parametersService.getIdiomas(),
        };

      case 'DP_PROFESORES':
        return {
          status: 'success',
          message: 'Profesores obtenidos correctamente',
          data: await this.parametersService.getProfesores(),
        };

      default:
        return {
          status: 'error',
          message: `Tipo '${type}' no válido`,
          data: [],
        };
    }
  }
}
