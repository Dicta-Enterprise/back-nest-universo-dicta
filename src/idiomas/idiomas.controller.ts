import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { IdiomasService } from './idiomas.service';
import { CreateIdiomaDto } from './dto/create-idioma.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { UpdateIdiomaDto } from './dto/update-idioma.dto';
import { ValidateIdioma } from './shared/decorators/validate-idioma.decorator';
import { IsIdiomaExist } from './shared/decorators/is-idioma-exist.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Idiomas')
@Controller('idiomas')
export class IdiomasController {

    constructor(
        private readonly idiomasService: IdiomasService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crea un nuevo Idioma' })
    @ApiBody({ type: CreateIdiomaDto })
    @ApiResponse({ status: 201, description: 'Idioma creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() @ValidateIdioma() createIdiomaDto: CreateIdiomaDto) {
        return this.idiomasService.create(createIdiomaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtiene todos los idiomas cuyo estado es ACTIVO' })
    @ApiResponse({ status: 200, description: 'Idiomas obtenidos exitosamente' })
    @ApiResponse({ status: 404, description: 'No se encontraron Idiomas' })
    findAll() {
        return this.idiomasService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un Idioma por ID' })
    @ApiParam({ name: 'id', example: '67d8668edb969ab56d6598dc', description: 'ID del Idioma' })
    @ApiResponse({ status: 200, description: 'Idioma encontrado' })
    @ApiResponse({ status: 404, description: 'No se encontró el idioma con el ID proporcionado' })
    findOne(@Param('id', ParseObjectIdPipe) id: string, @IsIdiomaExist() validated: any) {
        return this.idiomasService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualiza un idioma existente' })
    @ApiParam({ name: 'id', example: '67d84d9d3a2d6bcb7b19ca86', description: 'ID del Idioma' })
    @ApiBody({ type: UpdateIdiomaDto })
    @ApiResponse({ status: 200, description: 'Idioma actualizado correctamente' })
    @ApiResponse({ status: 404, description: 'No se encontró el idioma con el ID proporcionado' })
    update(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() @ValidateIdioma() updateIdiomaDto: UpdateIdiomaDto,
        @IsIdiomaExist() validated: any
    ) {
        return this.idiomasService.update(id, updateIdiomaDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Elimina un Idioma (cambia su estado a INACTIVO)' })
    @ApiParam({ name: 'id', example: '67d84d9d3a2d6bcb7b19ca86', description: 'ID del Idioma' })
    @ApiResponse({ status: 200, description: 'Idioma eliminado correctamente' })
    @ApiResponse({ status: 404, description: 'No se encontró el Idioma con el ID proporcionado' })
    remove(@Param('id', ParseObjectIdPipe) id: string, @IsIdiomaExist() validated: any) {
        return this.idiomasService.remove(id);
    }
}