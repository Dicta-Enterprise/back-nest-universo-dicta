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
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateIdiomaDto } from 'src/application/dto/idioma/create-idioma.dto';
import { UpdateIdiomaDto } from 'src/application/dto/idioma';
import * as useCase from 'src/application/uses-cases/idioma';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@ApiTags('Idiomas')
@Controller('idioma')
export class IdiomaController {
  constructor(
    private createIdiomaUseCase: useCase.CreateIdiomaUseCase,
    private getAllIdiomaUseCase:useCase.GetAllIdiomaUseCase,
    private DeleteIdiomaUseCase: useCase.DeleteIdiomaUseCase,
    private GetOnIdiomaUseCase: useCase.GetOneIdiomaUseCase,
    private UpdateIdiomaUseCase: useCase.ActualizarIdiomaCasoDeUso,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo idioma' })
  @ApiBody({ type: CreateIdiomaDto, description: 'Datos para crear el idioma' })
  @ApiResponse({ status: 201, description: 'Idioma creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createIdiomaDto: CreateIdiomaDto) {

    const result = await this.createIdiomaUseCase.execute(createIdiomaDto);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Idioma creado',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los idiomas' })
  @ApiResponse({ status: 200, description: 'Lista de idiomas obtenida correctamente' })
  @ApiResponse({ status: 400, description: 'Error al obtener los idiomas' })
  async getAll() {
    const result = await this.getAllIdiomaUseCase.execute();

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Idiomas obtenidos',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un idioma por ID' })
  @ApiParam({ name: 'id', description: 'ID del idioma', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Idioma obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Idioma no encontrado' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.GetOnIdiomaUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Idioma obtenido',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un idioma' })
  @ApiParam({ name: 'id', description: 'ID del idioma', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiBody({ type: UpdateIdiomaDto, description: 'Datos para actualizar el idioma' })
  @ApiResponse({ status: 200, description: 'Idioma actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Idioma no encontrado' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateIdioma: UpdateIdiomaDto,
  ) {
    const result = await this.UpdateIdiomaUseCase.execute(
      id,
      updateIdioma,
    );

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Idioma actualizado',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un idioma' })
  @ApiParam({ name: 'id', description: 'ID del idioma', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Idioma eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Idioma no encontrado' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {

    const result = await this.DeleteIdiomaUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Idioma eliminado',
    };
  }
}
