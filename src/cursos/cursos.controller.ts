import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, NotFoundException } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { ApiResponse } from '@nestjs/swagger';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @ApiResponse({status: 201, description: 'Curso creado', type: CreateCursoDto})
  @Post()
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cursosService.findOne(id);
  }

  @ApiResponse({status: 200, description: 'Curso actualizado', type: UpdateCursoDto})
  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cursosService.remove(id);
  }
}
