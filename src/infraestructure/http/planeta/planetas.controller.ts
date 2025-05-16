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
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import * as useCase from 'src/application/uses-cases/planeta';
import * as dto from 'src/application/dto/planeta';

@Controller('planetas')
export class planetaController {
  constructor(
    private createUseCase: useCase.CreatePlanetaUseCase,
    private getAllPlanetaUseCase: useCase.GetAllPlanetaUseCase,
    private getOnePlanetaUseCase: useCase.GetOnePlanetaUseCase,
    private updatePlanetaUseCase: useCase.UpdatePlanetaUseCase,
    private deletePlanetaUseCase: useCase.DeletePlanetaUseCase,
  ) {}

  @Post()
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
  async getAll() {
    const result = await this.getAllPlanetaUseCase.execute();

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Planetas obtenidos',
    };
  }

  @Get(':id')
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