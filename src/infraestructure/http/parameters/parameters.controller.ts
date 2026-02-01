import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetParametersUseCase, GetParametersWithPaginationUseCase } from 'src/application/uses-cases/parameters/get-all-parameters.use-case';
import { GetParametersPaginationDto } from 'src/application/dto/parameters/parameters.dto';

@Controller('parameters')
@ApiTags('Parámetros')
export class ParametersController {
  constructor(
    private readonly getParametersUseCase: GetParametersUseCase,
    private readonly getParametersWithPaginationUseCase: GetParametersWithPaginationUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener parámetros del sistema' })
  @ApiResponse({ status: 200, description: 'Parámetros obtenidos correctamente' })
  @ApiResponse({ status: 400, description: 'Tipo de parámetro no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Tipo de parámetro a obtener',
    example: 'DP_CATEGORIAS'
  })
  async get(@Query() query: GetParametersPaginationDto) { 
    const result = await this.getParametersUseCase.execute(query);

    if (result.isFailure) {
      throw result.error;
    }

    const data = result.getValue();
    const message = query.type 
      ? `Parámetro ${query.type} obtenido correctamente`
      : 'Todos los parámetros obtenidos correctamente';

    return {
      status: 'success',
      message,
      data,
    };
  }

  @Get('pagination')
  @ApiOperation({ summary: 'Obtener parámetros del sistema con paginación completa' })
  @ApiResponse({ status: 200, description: 'Parámetros obtenidos correctamente' })
  @ApiResponse({ status: 400, description: 'Tipo de parámetro no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Tipo de parámetro a obtener. Si no se especifica, devuelve todos',
    example: 'DP_CATEGORIAS'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de resultados por página (por defecto: 10)',
    example: 10
  })
  async getWithPagination(@Query() query: GetParametersPaginationDto) { 
    const result = await this.getParametersWithPaginationUseCase.execute(query);

    if (result.isFailure) {
      throw result.error;
    }

    const data = result.getValue();
    const message = query.type 
      ? `Parámetro ${query.type} obtenido correctamente con paginación`
      : 'Todos los parámetros obtenidos correctamente con paginación';

    return {
      status: 'success',
      message,
      data,
    };
  }
}