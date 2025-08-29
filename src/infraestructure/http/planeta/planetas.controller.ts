import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import * as dto from 'src/application/dto/planeta/';
import { PlanetaPaginationDto } from 'src/application/dto/planeta/PlanetaPagination.dto';
import * as useCase from 'src/application/uses-cases/planeta';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@Controller('planetas')
export class planetasController {
  constructor(
    private createUseCase: useCase.CreatePlanetaUseCase,
    private getAllPlanetaUseCase: useCase.GetAllPlanetaUseCase,
    private getOnePlanetaUseCase: useCase.GetOnePlanetaUseCase,
    private updatePlanetaUseCase: useCase.UpdatePlanetaUseCase,
    private deletePlanetaUseCase: useCase.DeletePlanetaUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo planeta' })
  @ApiBody({ type: dto.CreatePlanetaDto })
  @ApiResponse({ status: 201, description: 'Planeta creado correctamente.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o planeta duplicado.',
  })
  async create(@Body() dto: dto.CreatePlanetaDto) {
    const result = await this.createUseCase.execute(dto);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result.getValue(),
      message: 'Planeta creado',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los planetas activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planetas obtenida correctamente.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para la paginación (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de resultados por página (por defecto: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'galaxiaId',
    required: false,
    type: String,
    description: 'Id de la galaxia (ObjectId de Mongo) para filtrar planetas',
    example: '66cf2c6a2df0a0135b7c0c1e',
  })
  async getAll(@Query() planetaPaginationDto: PlanetaPaginationDto) {
    const result =
      await this.getAllPlanetaUseCase.execute(planetaPaginationDto);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Planetas obtenidos',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un planeta por su ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del planeta (ObjectId)',
  })
  @ApiResponse({
    status: 200,
    description: 'Planeta encontrada correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Planeta no encontrada.' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOnePlanetaUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Planeta obtenida',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un planeta existente' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del planeta (ObjectId)',
  })
  @ApiBody({ type: dto.UpdatePlanetaDto })
  @ApiResponse({
    status: 200,
    description: 'Planeta actualizado correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePlanetaDto: dto.UpdatePlanetaDto,
  ) {
    const result = await this.updatePlanetaUseCase.execute(
      id,
      updatePlanetaDto,
    );

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Planeta actualizado',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un planeta (cambia estado a INACTIVO)' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del planeta (ObjectId)',
  })
  @ApiResponse({ status: 200, description: 'Planeta eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Planeta no encontrada.' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deletePlanetaUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Planeta eliminada',
    };
  }
}
