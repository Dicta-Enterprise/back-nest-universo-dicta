import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GalaxiasService } from './galaxias.service';
import { CreateGalaxiaDto } from './dto/create-galaxia.dto';
import { UpdateGalaxiaDto } from './dto/update-galaxia.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidateGalaxia } from './shared/decorators/validate-galaxia.decorator';
import { IsGalaxiaExist } from './shared/decorators/is-galaxia-exist.decorator';

@ApiTags('Galaxias')
@Controller('galaxias')
export class GalaxiasController {

  constructor(
    private readonly galaxiasService: GalaxiasService
  ) { }

  @Post()
  @ApiOperation({ summary: 'Crea una nueva Galaxia' })
  @ApiBody({ type: CreateGalaxiaDto })
  @ApiResponse({ status: 201, description: 'Galaxia creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() @ValidateGalaxia() createGalaxiaDto: CreateGalaxiaDto) {
    return this.galaxiasService.create(createGalaxiaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todas las galaxias cuyo estado es ACTIVO' })
  @ApiResponse({ status: 200, description: 'Galaxias obtenidas exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontraron Galaxias' })
  findAll() {
    return this.galaxiasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una Galaxia por ID' })
  @ApiParam({ name: 'id', example: '67d439c03899f864579e58a2', description: 'ID de Galaxia' })
  @ApiResponse({ status: 200, description: 'Galaxia encontrada' })
  @ApiResponse({ status: 404, description: 'No se encontró la galaxia con el ID proporcionado' })
  findOne(@Param('id', ParseObjectIdPipe) id: string, @IsGalaxiaExist() validated: any) {
    return this.galaxiasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una Galaxia existente' })
  @ApiParam({ name: 'id', example: '67d439c03899f864579e58a2', description: 'ID de Galaxia' })
  @ApiBody({ type: UpdateGalaxiaDto })
  @ApiResponse({ status: 200, description: 'Galaxia actualizada correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la Galaxia con el ID proporcionado' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() @ValidateGalaxia() updateGalaxiaDto: UpdateGalaxiaDto,
    @IsGalaxiaExist() validated: any
  ) {
    return this.galaxiasService.update(id, updateGalaxiaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una Galaxia (cambia su estado a INACTIVO)' })
  @ApiParam({ name: 'id', example: '67d439c03899f864579e58a2', description: 'ID de Galaxia' })
  @ApiResponse({ status: 200, description: 'Galaxia eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la Galaxia con el ID proporcionado' })
  remove(@Param('id', ParseObjectIdPipe) id: string, @IsGalaxiaExist() validated: any) {
    return this.galaxiasService.remove(id);
  }
}