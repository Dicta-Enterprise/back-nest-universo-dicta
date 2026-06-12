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
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import * as useCase from 'src/application/uses-cases/landing-page';

import { UpdateLandingPageDto } from 'src/application/dto/lading-page/update-landing-page.dto';
import { CreateLandingPageDto } from 'src/application/dto/lading-page/create-landing-page.dto';

@ApiTags('Landing Page')
@Controller('landing-page')
export class LandingPageController {
  constructor(
    private readonly createUseCase: useCase.CreateLandingPageUseCase,
    private readonly getAllUseCase: useCase.GetAllLandingPageUseCase,
    private readonly getOneUseCase: useCase.GetOneLandingPageUseCase,
    private readonly updateUseCase: useCase.UpdateLandingPageUseCase,
    private readonly deleteUseCase: useCase.DeleteLandingPageUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creación de Landing Page' })
  @ApiCreatedResponse({ description: 'La Landing Page ha sido creada exitosamente.' })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos o error en la lógica de negocio.' })
  async create(@Body() createDto: CreateLandingPageDto) {
    const result = await this.createUseCase.execute(createDto);

    if (result.isFailure) {
      throw new HttpException(
        result.error.message,
        HttpStatus.BAD_REQUEST
      );
    }
    
    return {
      data: result.getValue(), 
      message: 'Landing page creada',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listado de Landing Pages' })
  @ApiOkResponse({ description: 'Lista de Landing Pages obtenida exitosamente.' })
  @ApiBadRequestResponse({ description: 'Error al obtener la lista de Landing Pages.' })
  async getAll(
    @Query('planetaId') planetaId?: string,
    @Query('galaxiaId') galaxiaId?: string,
    @Query('categoriaId') categoriaId?: string,
  ) {
    const filters = { planetaId, galaxiaId, categoriaId };
    const result = await this.getAllUseCase.execute(filters);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result.getValue(), 
      message: 'Landing pages obtenidas',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta de Landing Page por ID' })
  @ApiParam({ name: 'id', description: 'ID de la Landing Page (MongoDB ObjectID)', type: String })
  @ApiOkResponse({ description: 'Landing Page encontrada exitosamente.' })
  @ApiNotFoundResponse({ description: 'Landing Page no encontrada.' })
  @ApiBadRequestResponse({ description: 'El formato del ID no es válido o hubo un error.' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result.getValue(), 
      message: 'Landing page obtenida',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualización de Landing Page' })
  @ApiParam({ name: 'id', description: 'ID de la Landing Page a actualizar (MongoDB ObjectID)', type: String })
  @ApiOkResponse({ description: 'Landing Page actualizada exitosamente.' })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos, formato del ID incorrecto o error en la actualización.' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDto: UpdateLandingPageDto,  
  ) {
    const result = await this.updateUseCase.execute(id, updateDto);

    if (result.isFailure) {
      throw new HttpException( result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result.getValue(), 
      message: 'Landing page actualizada',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminación de Landing Page' })
  @ApiParam({ name: 'id', description: 'ID de la Landing Page a eliminar (MongoDB ObjectID)', type: String })
  @ApiOkResponse({ description: 'Landing Page eliminada exitosamente.' })
  @ApiBadRequestResponse({ description: 'Formato del ID incorrecto o error al eliminar.' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result.getValue(), 
      message: 'Landing page eliminada',
    };
  }
}
