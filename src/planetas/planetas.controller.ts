import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlanetasService } from './planetas.service';
import { CreatePlanetaDto } from './dto/create-planeta.dto';
import { UpdatePlanetaDto } from './dto/update-planeta.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Planetas') // Agrupa estos endpoints bajo la categoría "Planetas" en Swagger
@Controller('planetas')
export class PlanetasController {
  constructor(private readonly planetasService: PlanetasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un planeta', description: 'Registra un nuevo planeta en la base de datos.' })
  @ApiResponse({ status: 201, description: 'Planeta creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos incorrectos.' })
  create(@Body() createPlanetaDto: CreatePlanetaDto) {
    return this.planetasService.create(createPlanetaDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos los planetas', description: 'Obtiene una lista de planetas activos.' })
  @ApiResponse({ status: 200, description: 'Lista de planetas obtenida exitosamente.' })
  findAll() {
    return this.planetasService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un planeta', description: 'Devuelve la información de un planeta por su ID.' })
  @ApiResponse({ status: 200, description: 'Planeta encontrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Planeta no encontrado.' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.planetasService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un planeta', description: 'Modifica los datos de un planeta existente.' })
  @ApiResponse({ status: 200, description: 'Planeta actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Planeta no encontrado.' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePlanetaDto: UpdatePlanetaDto,
  ) {
    return this.planetasService.update(id, updatePlanetaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un planeta', description: 'Marca un planeta como inactivo en la base de datos.' })
  @ApiResponse({ status: 200, description: 'Planeta eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Planeta no encontrado.' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.planetasService.remove(id);
  }
  }