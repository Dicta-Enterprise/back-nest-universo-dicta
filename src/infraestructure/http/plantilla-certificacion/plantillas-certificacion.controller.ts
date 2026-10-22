import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as dto from 'src/application/dto/plantilla-certificacion';
import * as useCase from 'src/application/uses-cases/plantilla-certificacion';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@ApiTags('Plantillas de Certificación')
@Controller('plantillas-certificacion')
export class PlantillasCertificacionController {
  constructor(
    private createUseCase: useCase.CreatePlantillaCertificacionUseCase,
    private getAllUseCase: useCase.GetAllPlantillasCertificacionUseCase,
    private getOneUseCase: useCase.GetOnePlantillaCertificacionUseCase,
    private updateUseCase: useCase.UpdatePlantillaCertificacionUseCase,
    private activarUseCase: useCase.ActivarPlantillaCertificacionUseCase,
    private desactivarUseCase: useCase.DesactivarPlantillaCertificacionUseCase,
    private deleteUseCase: useCase.DeletePlantillaCertificacionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crea una nueva plantilla de certificación' })
  @ApiResponse({ status: 201, description: 'Plantilla creada correctamente.' })
  @ApiResponse({
    status: 400,
    description:
      'Datos inválidos, configuración vacía, o ya existe una plantilla activa con el mismo nombre/tipo.',
  })
  async create(@Body() dtoPlantilla: dto.CreatePlantillaCertificacionDto) {
    const result = await this.createUseCase.execute(dtoPlantilla);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result.getValue(),
      message: 'Plantilla de certificación creada correctamente',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Lista las plantillas de certificación (filtrable por estado y tipo)',
  })
  @ApiResponse({ status: 200, description: 'Listado obtenido correctamente.' })
  async findAll(@Query() filtros: dto.FiltrarPlantillasQueryDto) {
    const result = await this.getAllUseCase.execute(filtros);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Plantillas obtenidas.' };
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID (ObjectId de Mongo) de la plantilla.' })
  @ApiOperation({ summary: 'Obtiene el detalle de una plantilla de certificación' })
  @ApiResponse({ status: 200, description: 'Plantilla encontrada.' })
  @ApiResponse({ status: 400, description: 'ID inválido o plantilla no encontrada.' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Plantilla obtenida.' };
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID (ObjectId de Mongo) de la plantilla.' })
  @ApiOperation({ summary: 'Actualiza la información y configuración de una plantilla' })
  @ApiResponse({ status: 200, description: 'Plantilla actualizada correctamente.' })
  @ApiResponse({
    status: 400,
    description:
      'Datos inválidos, plantilla no encontrada, o choque de nombre/tipo activo.',
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dtoPlantilla: dto.UpdatePlantillaCertificacionDto,
  ) {
    const result = await this.updateUseCase.execute(id, dtoPlantilla);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Plantilla actualizada correctamente' };
  }

  @Patch(':id/activar')
  @ApiParam({ name: 'id', description: 'ID (ObjectId de Mongo) de la plantilla.' })
  @ApiOperation({ summary: 'Activa una plantilla previamente desactivada' })
  @ApiResponse({ status: 200, description: 'Plantilla activada correctamente.' })
  @ApiResponse({
    status: 400,
    description: 'Ya existe otra plantilla activa con el mismo nombre o tipo de certificación.',
  })
  async activar(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.activarUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Plantilla activada correctamente' };
  }

  @Patch(':id/desactivar')
  @ApiParam({ name: 'id', description: 'ID (ObjectId de Mongo) de la plantilla.' })
  @ApiOperation({ summary: 'Desactiva una plantilla sin eliminarla físicamente' })
  @ApiResponse({ status: 200, description: 'Plantilla desactivada correctamente.' })
  @ApiResponse({ status: 400, description: 'Plantilla no encontrada.' })
  async desactivar(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.desactivarUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Plantilla desactivada correctamente' };
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID (ObjectId de Mongo) de la plantilla.' })
  @ApiOperation({
    summary: 'Elimina una plantilla físicamente, solo si no tiene certificaciones asociadas',
  })
  @ApiResponse({ status: 200, description: 'Plantilla eliminada correctamente.' })
  @ApiResponse({
    status: 400,
    description:
      'Plantilla no encontrada, o ya fue utilizada para emitir certificaciones (desactívala en su lugar).',
  })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { message: 'Plantilla eliminada correctamente' };
  }
}
