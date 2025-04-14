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
import * as useCase from 'src/application/uses-cases/categoria';
import * as dto from 'src/application/dto/categoria/dto';

@Controller('categorias')
export class CategoriaController {
  constructor(
    private createUseCase: useCase.CreateCategoriaUseCase,
    private getAllCategoriaUseCase: useCase.GetAllCategoriaUseCase,
    private getOneCategoriaUseCase: useCase.GetOneCategoriaUseCase,
    private updateCategoriaUseCase: useCase.UpdateCategoriaUseCase,
    private deleteCategoriaUseCase: useCase.DeleteCategoriaUseCase,
  ) {}

  @Post()
  async create(@Body() dto: dto.CreateCategoriaDto) {
    const result = await this.createUseCase.execute(dto);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result.getValue(),
      message: 'Categoría creada',
    };
  }

  @Get()
  async getAll() {
    const result = await this.getAllCategoriaUseCase.execute();

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Categorías obtenidas',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneCategoriaUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Categoría obtenida',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCategoriaDto: dto.UpdateCategoriaDto,
  ) {
    const result = await this.updateCategoriaUseCase.execute(
      id,
      updateCategoriaDto,
    );

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Categoría actualizada',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteCategoriaUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Categoría eliminada',
    };
  }
}
