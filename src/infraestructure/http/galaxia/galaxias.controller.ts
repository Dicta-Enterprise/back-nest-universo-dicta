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
import { GalaxiasService } from '../../../core/services/galaxia/galaxias.service';

import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import * as useCase from 'src/application/uses-cases/galaxias';

@Controller('galaxias')
export class GalaxiasController {
  constructor(
    private readonly galaxiasService: GalaxiasService,

    private readonly getAllGalaxiaUseCase: useCase.GetAllGalaxiaUseCase,
    private readonly createUseCase: useCase.CreateGalaxiaUseCase,
    private readonly getOneGalaxiaUseCase: useCase.GetOneGalaxiaUseCase,
    private readonly updateGalaxiaUseCase: useCase.UpdateGalaxiaUseCase,
    private readonly deleteGalaxiaUseCase: useCase.DeleteGalaxiaUseCase,
  ) {}

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
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.galaxiasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateGalaxiaDto: UpdateGalaxiaDto,
  ) {
    return this.galaxiasService.update(id, updateGalaxiaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.galaxiasService.remove(id);
  }
}
