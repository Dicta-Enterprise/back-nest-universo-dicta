import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { CreateLandingPageDto } from './dto/create-landing-page.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { UpdateLandingPageDto } from './dto/update-landing-page';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidateLandingPage } from './shared/decorators/validate-landing.decorator';
import { IsLandingPageExist } from './shared/decorators/is-landing-page-exist.decorator';

// Para acceder a Swagger : http://localhost:3000/api
@ApiTags('Landing Page')
@Controller('landing-page')
export class LandingPageController {

    constructor(
        private readonly landingPageService: LandingPageService
    ) { }

    // Manejo completo de CRUD 
    // Post - crear
    @Post()
    @ApiOperation({ summary: 'Crea una nueva Landing Page' })
    @ApiBody({ type: CreateLandingPageDto })
    @ApiResponse({ status: 201, description: 'Landing Page creada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() @ValidateLandingPage() createLandingPageDto: CreateLandingPageDto) {
        return this.landingPageService.create(createLandingPageDto); // Ubicar este método en landing-page.service
    }

    // Get - Obtener todas las landings
    @Get()
    @ApiOperation({ summary: 'Obtiene todas las Landing Pages cuyo estado es ACTIVO' })
    @ApiResponse({ status: 200, description: 'Landing Pages obtenidas exitosamente' })
    @ApiResponse({ status: 404, description: 'No se encontraron Landing Pages' })
    findAll() {
        return this.landingPageService.findAll();
    }

    // Get(:id) - Obtener una landing por id
    @Get(':id')
    @ApiOperation({ summary: 'Obtiene una Landing Page por ID' })
    @ApiParam({ name: 'id', example: '67d233e71bb71f59d56de0b8', description: 'ID de la Landing Page' })
    @ApiResponse({ status: 200, description: 'Landing Page encontrada' })
    @ApiResponse({ status: 404, description: 'No se encontró la Landing Page con el ID proporcionado' })
    findOne(@Param('id', ParseObjectIdPipe) id: string, @IsLandingPageExist() validated: any) {
        return this.landingPageService.findOne(id);
    }

    // Patch(:id) - Actualizar
    @Patch(':id')
    @ApiOperation({ summary: 'Actualiza una Landing Page existente' })
    @ApiParam({ name: 'id', example: '67d233e71bb71f59d56de0b8', description: 'ID de la Landing Page' })
    @ApiBody({ type: UpdateLandingPageDto })
    @ApiResponse({ status: 200, description: 'Landing Page actualizada correctamente' })
    @ApiResponse({ status: 404, description: 'No se encontró la Landing Page con el ID proporcionado' })
    update(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() @ValidateLandingPage() updateLandingPageDto: UpdateLandingPageDto,
        @IsLandingPageExist() validated: any
    ) {
        return this.landingPageService.update(id, updateLandingPageDto)
    }

    // Delete - Eliminar (Cambia el estado)
    @Delete(':id')
    @ApiOperation({ summary: 'Elimina una Landing Page (cambia su estado a INACTIVO)' })
    @ApiParam({ name: 'id', example: '67d233e71bb71f59d56de0b8', description: 'ID de la Landing Page' })
    @ApiResponse({ status: 200, description: 'Landing Page eliminada correctamente' })
    @ApiResponse({ status: 404, description: 'No se encontró la Landing Page con el ID proporcionado' })
    remove(@Param('id', ParseObjectIdPipe) id: string, @IsLandingPageExist() validated: any) {
        return this.landingPageService.remove(id);
    }
}