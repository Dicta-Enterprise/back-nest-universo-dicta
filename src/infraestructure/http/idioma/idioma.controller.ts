import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Param,
  Patch,
  Get,
  Delete,
} from '@nestjs/common';
import { CreateIdiomaDto } from 'src/application/dto/idioma/create-idioma.dto';
import { UpdateIdiomaDto } from 'src/application/dto/idioma';
import * as useCase from 'src/application/uses-cases/idioma';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@Controller('idioma')
export class IdiomaController {
  constructor(
    private createIdiomaUseCase: useCase.CreateIdiomaUseCase,
    private getAllIdiomaUseCase:useCase.GetAllIdiomaUseCase,
    private DeleteIdiomaUseCase: useCase.DeleteIdiomaUseCase,
    private GetOnIdiomaUseCase: useCase.GetOneIdiomaUseCase,
    private UpdateIdiomaUseCase: useCase.ActualizarIdiomaCasoDeUso,
  ) {}

  @Post()
  async create(@Body() createIdiomaDto: CreateIdiomaDto) {
    
    const result = await this.createIdiomaUseCase.execute(createIdiomaDto);
    
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Idioma creado',
    };
  }
  @Get()
    async getAll() {
      const result = await this.getAllIdiomaUseCase.execute();
  
      if (result.isFailure) {
        throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
      }
  
      return {
        data: result,
        message: 'Idioma obtenidas',
      };
    }
    @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.GetOnIdiomaUseCase.execute(id);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Idioma obtenida',
    };
  }
  @Patch(':id')
    async update(
      @Param('id', ParseObjectIdPipe) id: string,
      @Body() updateIdioma: UpdateIdiomaDto,
    ) {
      const result = await this.UpdateIdiomaUseCase.execute(
        id,
        updateIdioma,
      );
  
      if (result.isFailure) {
        throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
      }
  
      return {
        data: result,
        message: 'Idioma ACtulizado',
      };
    }
  @Delete(':id')
    async remove(@Param('id', ParseObjectIdPipe) id: string) {
     
      const result = await this.DeleteIdiomaUseCase.execute(id);
  
      if (result.isFailure) {
        throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
      }
  
      return {
        data: result,
        message: 'Idioma eliminada',
      };
    }
}
