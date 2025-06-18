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
import { ParseObjectIdPipe } from "src/shared/pipes/parse-object-id.pipe";
import * as useCase from "src/application/uses-cases/landing-page";

// Importar los DTOs correspondientes:
import { UpdateLandingPageDto } from 'src/application/dto/lading-page/update-landing-page.dto';
import { CreateLandingPageDto } from 'src/application/dto/lading-page/create-landing-page.dto';

@Controller('landing-page')
export class LandingPageController {
  constructor(
    private readonly createUseCase: useCase.CreateLandingPageUseCase,
    private readonly getAllUseCase: useCase.GetAllLandingPageUseCase,
    private readonly getOneUseCase: useCase.GetOneLandingPageUseCase,
    private readonly updateUseCase: useCase.UpdateLandingPageUseCase,
    private readonly deleteUseCase: useCase.DeleteLandingPageUseCase,
  ) {}

  // Método POST para crear una nueva landing page
  @Post()
  async create(@Body() createDto: CreateLandingPageDto) {
    const result = await this.createUseCase.execute(createDto);

    if ('error' in result) {
      throw new HttpException(
        (result.error as { message: string }).message,
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      data: result,
      message: 'Landing page creada',
    };
  }

  // Método GET para obtener todas las landing pages
  @Get()
  async getAll() {
    const result = await this.getAllUseCase.execute();

    if (!Array.isArray(result)) {
      throw new HttpException(
        'Error al obtener landing pages',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      data: result,
      message: 'Landing pages obtenidas',
    };
  }

  // Método GET para obtener una landing page por su ID
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneUseCase.execute(id);

    if (!result) {
      throw new HttpException('Landing page no encontrada', HttpStatus.NOT_FOUND);
    }

    return {
      data: result,
      message: 'Landing page obtenida',
    };
  }

  // Método PATCH para actualizar una landing page existente
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDto: UpdateLandingPageDto,  
  ) {
    const result = await this.updateUseCase.execute(id, updateDto);

    if ('isFailure' in result && result.isFailure) {
      const errorMessage =
        'error' in result &&
        result.error &&
        typeof result.error === 'object' &&
        result.error !== null &&
        'message' in result.error &&
        typeof (result.error as { message?: unknown }).message === 'string'
          ? (result.error as { message: string }).message
          : 'Error al actualizar la landing page';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Landing page actualizada',
    };
  }

  // Método DELETE para eliminar una landing page por su ID
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteUseCase.execute(id);

    if (!result) {
      throw new HttpException('Landing page no encontrada o no pudo ser eliminada', HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Landing page eliminada',
    };
  }
}
