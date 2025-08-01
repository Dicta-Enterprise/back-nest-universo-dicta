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
import { CursosService } from '../../../core/services/curso/cursos.service';
import * as useCase from 'src/application/uses-cases/curso';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import * as dto from 'src/application/dto/curso';
import * as azureCase from 'src/application/uses-cases/azure';
import { RequiredFile } from 'src/shared/decorator/required-file.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('cursos')
export class CursosController {
  constructor(
      private createUseCase: useCase.CreateCursoUseCase,
      private getAllCursoUseCase: useCase.GetAllCursoUseCase,
      private getOneCursoUseCase: useCase.GetOneCursoUseCase,
      private updateCursoUseCase: useCase.UpdateCursoUseCase,
      private deleteCursoUseCase: useCase.DeleteCursoUseCase,
      private readonly saveImageStorageUseCase: azureCase.SaveImageStorageUseCase,
      private readonly deleteImageStorageUseCase: azureCase.DeleteImageStorageUseCase,
    ) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo curso' })
  @ApiBody({ type: dto.CreateCursoDto })
  @ApiResponse({ status: 201, description: 'El curso fue creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(/*@RequiredFile() file: Express.Multer.File,*/ @Body() dtoCurso: dto.CreateCursoDto,) {
    /*const imageResult = await this.saveImageStorageUseCase.execute(file, 'cursos');
    
      if (imageResult.isFailure) {
          throw new HttpException(
            imageResult.error.message,
            HttpStatus.BAD_REQUEST,
          );
      }*/
    
      const result = await this.createUseCase.execute(dtoCurso);
    
      if (result.isFailure) {
          //await this.deleteImageStorageUseCase.execute(imageResult.getValue());
          throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
      }
    
      return {
          data: result.getValue(),
          message: 'Curso creado',
      };
  }

  @Get()
  @ApiOperation({ summary: 'Recibe todos los cursos que se encuentren activos(estado = true).' })
  @ApiResponse({ status: 200, description: 'Cursos obtenidos exitosamente.' })
  @ApiResponse({ status: 404, description: 'No se encontraron cursos.' })
  async findAll() {
    const result = await this.getAllCursoUseCase.execute();

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Cursos obtenidos.',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recibe a un curso mediante su ID.' })
  @ApiParam({ name: 'id', example: '5f43e9b5e3f1c530d8b6f8a9', description: 'ID del curso.' })
  @ApiResponse({ status: 200, description: 'Curso encontrado.' })
  @ApiResponse({ status: 404, description: 'No se encontró el curso con el ID proporcionado.' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneCursoUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Curso obtenido.',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza los datos de un curso y cambia o mantiene su estado en true(activo).' })
  @ApiParam({ name: 'id', example: '5f43e9b5e3f1c530d8b6f8a9', description: 'ID del curso.' })
  @ApiBody({ type: dto.CreateCursoDto })
  @ApiResponse({ status: 200, description: 'Curso actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'No se encontró el curso con el ID proporcionado.' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCursoDto: dto.UpdateCursoDto,
  ) {
    const result = await this.updateCursoUseCase.execute(
      id,
      updateCursoDto,
    );

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Curso actualizado',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cambia el estado de un curso a false(curso inactivo).' })
  @ApiParam({ name: 'id', example: '5f43e9b5e3f1c530d8b6f8a9', description: 'ID del curso.' })
  @ApiResponse({ status: 200, description: 'Curso eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'No se encontró el curso con el ID proporcionado.' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteCursoUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Curso eliminado',
    };
  }
}
