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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as dto from 'src/application/dto/categoria';
import * as azureCase from 'src/application/uses-cases/azure';
import * as useCase from 'src/application/uses-cases/categoria';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriaController {
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
  @UseInterceptors(FileInterceptor('modelo'))
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiBody({
    type: dto.CreateCategoriaDto,
    description: 'Datos para crear la categoría',
  })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  async create(@Body() body: dto.CreateCategoriaDto, @UploadedFile() file: Express.Multer.File) {
    const result = await this.createUseCase.execute(body,file);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Categoría creada',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida correctamente',
  })
  @ApiResponse({ status: 400, description: 'Error al obtener las categorías' })
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
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', type: String })
  @ApiResponse({ status: 200, description: 'Categoría obtenida correctamente' })
  @ApiResponse({ status: 400, description: 'Error al obtener la categoría' })
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
  @UseInterceptors(FileInterceptor('modelo')) 
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', type: String })
  @ApiBody({
    type: dto.UpdateCategoriaDto,
    description: 'Datos para actualizar la categoría',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada correctamente',
  })
  @ApiResponse({ status: 400, description: 'Error al actualizar la categoría' })
 async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCategoriaDto: dto.UpdateCategoriaDto,
    @UploadedFile() file?: Express.Multer.File,
  )  {
   const result = await this.updateCategoriaUseCase.execute(
      id,
      updateCategoriaDto,
      file, 
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
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', type: String })
  @ApiResponse({
    status: 200,
    description: 'Categoría eliminada correctamente',
  })
  @ApiResponse({ status: 400, description: 'Error al eliminar la categoría' })
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
