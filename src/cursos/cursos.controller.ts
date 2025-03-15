import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, NotFoundException, UsePipes, Put } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { ApiResponse, ApiParam, ApiCreatedResponse, ApiBadRequestResponse, ApiConflictResponse, ApiOperation, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Curso } from './entities/curso.entity';
import { ValidarRelacionesPipe } from 'src/shared/pipes/validacion-relacion-entidades.pipe';
import { ValidarIDEntidadPipe } from 'src/shared/pipes/validar-ID-entidad.pipe';
import { ValidarNombreDuplicadoPipe } from 'src/shared/pipes/validar-nombreDuplicado.pipe';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @ApiOperation({summary: 'Crear un Curso'})
  @ApiCreatedResponse({description: 'Curso creado', type: Curso})
  @ApiBadRequestResponse({description: 'Error al crear el Curso Datos Invalidos'})
  @ApiResponse({ status: 400 ,description: 'La fecha de finalización debe ser posterior a la fecha de inicio'})
  @ApiConflictResponse({description: 'El Curso con este nombre (Curso ....) ya existe. ID: 67981138bb00c415258372a9'})
  @UsePipes(ValidarRelacionesPipe)
  create(@Body(new ValidarNombreDuplicadoPipe('curso')) createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  @ApiOperation({summary: 'Listar Cursos'})
  @ApiOkResponse({description: 'Lista de Cursos', schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(Curso) },
          { $ref: getSchemaPath(Curso) }
        ],
      },
    },
  })
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Buscar Curso por ID'})
  @ApiResponse({status: 200, description: 'Curso Encontrado por ID', type: Curso})
  @ApiParam({ name: 'id', required: true, example: '67951f48ac0dee7220ed8462', description: 'El ID del Curso' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cursosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({summary: 'Actualizar Curso por ID'})
  @ApiParam({ name: 'id', required: true, example: '67951f48ac0dee7220ed8462', description: 'El ID del Curso' })
  @ApiResponse({status: 200, description: 'Curso actualizado', type: UpdateCursoDto})
  @ApiBadRequestResponse({description: 'Error al Actualizar el Curso Datos Invalidos'})
  @ApiConflictResponse({description: 'El Curso buscado no existe o esta Inactivo'})
  update(@Param('id', ParseObjectIdPipe, new ValidarIDEntidadPipe('curso')) id: string, @Body(new ValidarNombreDuplicadoPipe('curso')) updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Desabilitar Curso por ID'})
  @ApiParam({ name: 'id', required: true, example: '679ae2ead96523d65fcf66f9', description: 'El ID del Curso' })
  @ApiResponse({status: 200, description: 'Curso Inavilitado'})
  @ApiConflictResponse({description: 'El Curso buscado no existe o esta Inactivo'})
  remove(@Param('id', ParseObjectIdPipe, new ValidarIDEntidadPipe('curso')) id: string) {
    return this.cursosService.remove(id);
  }
}
