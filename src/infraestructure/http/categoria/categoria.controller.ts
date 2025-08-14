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
import * as dto from 'src/application/dto/categoria';
import * as azureCase from 'src/application/uses-cases/azure';
import * as useCase from 'src/application/uses-cases/categoria';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@Controller('categorias')
export class CategoriaController {
  deleteUseCase: any;
  constructor(
    private createUseCase: useCase.CreateCategoriaUseCase,
    private getAllCategoriaUseCase: useCase.GetAllCategoriaUseCase,
    private getOneCategoriaUseCase: useCase.GetOneCategoriaUseCase,
    private updateCategoriaUseCase: useCase.UpdateCategoriaUseCase,
    private deleteCategoriaUseCase: useCase.DeleteCategoriaUseCase,
    private readonly saveImageStorageUseCase: azureCase.SaveImageStorageUseCase,
    private readonly deleteImageStorageUseCase: azureCase.DeleteImageStorageUseCase,
  ) {}

  @Post()
  // @UseInterceptors(FileInterceptor('file'))  <-- comentado para no requerir archivo
  async create(
    // @RequiredFile() file: Express.Multer.File, <-- comentado
    @Body() dto: dto.CreateCategoriaDto,
  ) {
    // Si quieres subir imagen opcionalmente, podrías usar algo así:
    // let imageResult;
    // if (file) {
    //   imageResult = await this.saveImageStorageUseCase.execute(file, 'categorias');
    //   if (imageResult.isFailure) {
    //     throw new HttpException(imageResult.error.message, HttpStatus.BAD_REQUEST);
    //   }
    // }

    const result = await this.createUseCase.execute(
      dto /*, imageResult?.getValue() */,
    );

    if (result.isFailure) {
      // if (imageResult) await this.deleteImageStorageUseCase.execute(imageResult.getValue());
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
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
