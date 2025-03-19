import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { ValidarIDEntidadPipe } from 'src/shared/pipes/validar-ID-entidad.pipe';
import { ValidarDuplicadosInterceptor } from 'src/shared/interceptor/validar-duplicados.interceptor';

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  @ApiOperation({summary: 'Crear un Profesor'})
  @ApiCreatedResponse({description: 'Profesor creado'})
  @ApiBadRequestResponse({description: 'Error al crear el Profesor Datos Invalidos'})
  @ApiConflictResponse({description: 'El Profesor con este correo electrónico ya existe'})
  @UseInterceptors(new ValidarDuplicadosInterceptor('profesor', ['email', 'apellido']))
  create(@Body() createProfesorDto: CreateProfesorDto) {
    return this.profesorService.create(createProfesorDto);
  }

  @Get()
  @ApiOperation({summary: 'Listar Profesores'})
  findAll() {
    return this.profesorService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Buscar Profesor por ID'})
  @ApiResponse({status: 200, description: 'Profesor Encontrado por ID', type: UpdateProfesorDto})
  @ApiParam({ name: 'id', required: true, example: '67951f48ac0dee7220ed8462', description: 'El ID del Profesor' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.profesorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Actualizar Profesor por ID'})
  @ApiParam({ name: 'id', required: true, example: '67951f48ac0dee7220ed8462', description: 'El ID del Profesor' })
  @ApiResponse({status: 200, description: 'Profesor actualizado', type: UpdateProfesorDto})
  @UseInterceptors(new ValidarDuplicadosInterceptor('profesor', ['email', 'apellido']))
  update(@Param('id', ParseObjectIdPipe, new ValidarIDEntidadPipe('profesor')) id: string, @Body() updateProfesorDto: UpdateProfesorDto) {
    return this.profesorService.update(id, updateProfesorDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Eliminar Profesor por ID'})
  @ApiParam({ name: 'id', required: true, example: '67951f48ac0dee7220ed8462', description: 'El ID del Profesor' })
  @ApiResponse({status: 200, description: 'Profesor Inavilitado'})
  remove(@Param('id', ParseObjectIdPipe, new ValidarIDEntidadPipe('profesor')) id: string) {
    return this.profesorService.remove(id);
  }
}
