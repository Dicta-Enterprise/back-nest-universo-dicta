import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { createProfesorDto, updateProfesorDto } from 'src/application/dto/profesor';
import * as useCase from 'src/application/uses-cases/profesor/index';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { DeleteProfesorUseCase } from '../../../application/uses-cases/profesor/delete-profesor.use-case';

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
