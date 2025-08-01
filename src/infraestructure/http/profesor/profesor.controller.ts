import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { createProfesorDto, updateProfesorDto } from 'src/application/dto/profesor';
import * as useCase from 'src/application/uses-cases/profesor/index';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@Controller('profesores')
export class ProfesorController {

    constructor(
        private createUseCase: useCase.CreateProfesorUseCase,
        private getAllProfesoresCase: useCase.GetAllProfesorUseCase,
        private getOneProfesorCase: useCase.GetOneProfesorUseCase,
        private deleteProfesorCase: useCase.DeleteProfesorUseCase,
        private updateProfesorCase: useCase.UpdateProfesorUseCase,
    ){}

    @Post()
    @ApiOperation({ summary: 'Crea un nuevo profesor' })
    @ApiBody({ type: createProfesorDto })
    @ApiResponse({ status: 201, description: 'El profesor fue creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(@Body() dtoProfesor: createProfesorDto ){
        const result = await this.createUseCase.execute(dtoProfesor);

        if(result.isFailure){
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }

        return {
            data: result.getValue(),
            message: 'Profesor creado.'
        }

    }

    @Get()
    @ApiOperation({ summary: 'Recibe todos los profesores que se encuentren activos(estado = true).' })
    @ApiResponse({ status: 200, description: 'Profesores obtenidos exitosamente.' })
    @ApiResponse({ status: 404, description: 'No se encontraron profesores.' })
    async getAll() {
        const result = await this.getAllProfesoresCase.execute();
    
        if (result.isFailure) {
          throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
    
        return {
          data: result,
          message: 'Profesores obtenidos',
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Recibe a un profesor mediante su ID.' })
    @ApiParam({ name: 'id', example: '67d233e71bb71f59d56de0b8', description: 'ID del profesor.' })
    @ApiResponse({ status: 200, description: 'Profesor encontrado.' })
    @ApiResponse({ status: 404, description: 'No se encontró el profesor con el ID proporcionado.' })
      async findOne(@Param('id', ParseObjectIdPipe) id: string) {
        const result = await this.getOneProfesorCase.execute(id);
    
        if (result.isFailure) {
          throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
    
        return {
          data: result,
          message: 'Profesor obtenido',
        };
      }

    @Delete(':id')
    @ApiOperation({ summary: 'Cambia el estado de un profesor a false(profesor inactivo).' })
    @ApiParam({ name: 'id', example: '67d233e71bb71f59d56de0b8', description: 'ID del profesor.' })
    @ApiResponse({ status: 200, description: 'Profesor eliminado correctamente.' })
    @ApiResponse({ status: 404, description: 'No se encontró el profesor con el ID proporcionado.' })
      async remove(@Param('id', ParseObjectIdPipe) id: string) {
        const result = await this.deleteProfesorCase.execute(id);
      
        if (result.isFailure) {
          throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
      
        return {
          data: result,
          message: 'Profesor eliminado.',
        };
      }

      
      @Patch(':id')
      @ApiOperation({ summary: 'Actualiza los datos de un Profesor y cambia o mantiene su estado en true(activo).' })
      @ApiParam({ name: 'id', example: '67d233e71bb71f59d56de0b8', description: 'ID del profesor.' })
      @ApiBody({ type: createProfesorDto })
      @ApiResponse({ status: 200, description: 'Profesor actualizado correctamente.' })
      @ApiResponse({ status: 404, description: 'No se encontró el profesor con el ID proporcionado.' })
      async update(@Param('id', ParseObjectIdPipe) id:string, @Body() updateProfesorDto: updateProfesorDto){
        const result = await this.updateProfesorCase.execute(
          id,
          updateProfesorDto,
        );
    
        if (result.isFailure) {
          throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
    
        return {
          data: result,
          message: 'Profesor actualizado',
        };
      }


}
