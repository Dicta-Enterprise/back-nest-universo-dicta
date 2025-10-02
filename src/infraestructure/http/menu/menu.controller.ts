import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateMenuDto } from 'src/application/dto/menu/create-menu.dto';
import { UpdateMenuDto } from 'src/application/dto/menu/update-menu.dto';
import { MenuService } from 'src/core/services/menu/menu.service';

@ApiTags('Menús')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo menú' })
  @ApiBody({ type: CreateMenuDto, description: 'Datos para crear el menú' })
  @ApiResponse({ status: 201, description: 'Menú creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los menús' })
  @ApiResponse({ status: 200, description: 'Lista de menús obtenida correctamente' })
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un menú por ID' })
  @ApiParam({ name: 'id', description: 'ID del menú', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Menú obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado' })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un menú' })
  @ApiParam({ name: 'id', description: 'ID del menú', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiBody({ type: UpdateMenuDto, description: 'Datos para actualizar el menú' })
  @ApiResponse({ status: 200, description: 'Menú actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado' })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un menú' })
  @ApiParam({ name: 'id', description: 'ID del menú', type: String, example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Menú eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
