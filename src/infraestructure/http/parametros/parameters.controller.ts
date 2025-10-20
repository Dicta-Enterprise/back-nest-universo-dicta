import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { GetAllParametersUseCase } from '../../../application/uses-cases/parametros/get-all-parameters.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Parámetros')
@Controller('parameters') // Definimos la ruta base o endpoint para este controlador: /parameters.
export class ParametersController {
  constructor(
    // Inyección de dependencia del UseCase para la lógica de obtención de parámetros a traves de USE CASE
    private readonly getAllParametersUseCase: GetAllParametersUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los parámetros' }) // Descripción de la operación para Swagger.
  @ApiResponse({ status: 200, description: 'Lista de parámetros obtenida correctamente' }) // Respuesta exitosa para Swagger.
  @ApiResponse({ status: 500, description: 'Error interno del servidor' }) // Respuesta de error para Swagger.
  async findAll() {
    const result = await this.getAllParametersUseCase.execute();
    if (result.isFailure) {
      //Lanza un error si el caso de uso falla
      throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      data: result.getValue(),
      status: 200,
      message: 'Parámetros obtenidos exitosamente',
    };
  }
}