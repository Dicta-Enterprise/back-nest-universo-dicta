import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import * as useCase from 'src/application/uses-cases/galaxias';

@Controller('galaxias')
export class GalaxiasController {
  constructor(
    private readonly getAllGalaxiaUseCase: useCase.GetAllGalaxiaUseCase,
    private readonly createUseCase: useCase.CreateGalaxiaUseCase,
    private readonly getOneGalaxiaUseCase: useCase.GetOneGalaxiaUseCase,
    private readonly updateGalaxiaUseCase: useCase.ActualizarGalaxiaCasoDeUso,
    private readonly deleteGalaxiaUseCase: useCase.DeleteGalaxiaUseCase,
  ) { }

  @Post()
  async create(@Body() createGalaxiaDto: CreateGalaxiaDto) {

    const result = await this.createUseCase.execute(createGalaxiaDto);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Galaxia creada',
    };
  }

  @Get()
  async findAll() {
    const result = await this.getAllGalaxiaUseCase.execute();

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Galaxias obtenidas',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneGalaxiaUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Galaxia obtenida',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateGalaxiaDto: UpdateGalaxiaDto,
  ) {
    const result = await this.updateGalaxiaUseCase.execute(
      id,
      updateGalaxiaDto,
    );

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Galaxia ACtulizado',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteGalaxiaUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result,
      message: 'Galaxia eliminada',
    };
  }
}
