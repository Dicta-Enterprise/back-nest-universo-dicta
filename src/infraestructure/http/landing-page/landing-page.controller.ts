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
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import * as useCase from 'src/application/uses-cases/landing-page';

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

  @Post()
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
