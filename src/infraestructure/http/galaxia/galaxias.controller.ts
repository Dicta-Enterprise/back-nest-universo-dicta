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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GalaxiaPaginationDto } from 'src/application/dto/galaxia';
import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { CreateMultipleGalaxiasDto } from 'src/application/dto/galaxia/create-multiple-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import { Galaxia3DResponseDto} from 'src/application/dto/galaxia/response-galaxia.dto';
import { GalaxiasPorCategoriaResponseDto } from 'src/application/dto/galaxia/galaxia-por-categoria-response.dto';
import * as azureCase from 'src/application/uses-cases/azure';
import * as useCase from 'src/application/uses-cases/galaxias';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@ApiTags('Galaxias')
@Controller('galaxias')
export class GalaxiasController {
  constructor(
    private readonly getAllGalaxiaUseCase: useCase.GetAllGalaxiaUseCase,
    private readonly createUseCase: useCase.CreateGalaxiaUseCase,
    private readonly createMultipleGalaxiasUseCase: useCase.CreateMultipleGalaxiasUseCase,
    private readonly getOneGalaxiaUseCase: useCase.GetOneGalaxiaUseCase,
    private readonly updateGalaxiaUseCase: useCase.ActualizarGalaxiaCasoDeUso,
    private readonly deleteGalaxiaUseCase: useCase.DeleteGalaxiaUseCase,
    private readonly saveImageStorageUseCase: azureCase.SaveImageStorageUseCase,
    private readonly getGalaxiasByCategoriaFor3DUseCase: useCase.GetAllGalaxiaUseCase, 
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva galaxia' })
  @ApiBody({ type: CreateGalaxiaDto })
  @ApiResponse({ status: 201, description: 'Galaxia creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  async create(@Body() createGalaxiaDto: CreateGalaxiaDto) {
    const result = await this.createUseCase.execute(createGalaxiaDto);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result.getValue(), 
      message: 'Galaxia creada exitosamente',
    };
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Crear múltiples galaxias con datos base compartidos' })
  @ApiBody({ type: CreateMultipleGalaxiasDto })
  @ApiResponse({ status: 201, description: 'Galaxias creadas exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  async createMultiple(@Body() createMultipleGalaxiasDto: CreateMultipleGalaxiasDto) {
    const result = await this.createMultipleGalaxiasUseCase.execute(
      createMultipleGalaxiasDto,
    );
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    
    const galaxiasCreadas = result.getValue();

    return {
      data: galaxiasCreadas, 
      message: `${galaxiasCreadas?.length || 0} galaxias creadas exitosamente`, 
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las galaxias (paginado)' })
  @ApiResponse({ status: 200, description: 'Lista de galaxias obtenida correctamente' })
  @ApiResponse({ status: 400, description: 'Error al obtener las galaxias' })
  async findAll(@Query() galaxiaPaginationDto: GalaxiaPaginationDto) {
    const result = await this.getAllGalaxiaUseCase.execute(galaxiaPaginationDto);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result.getValue(), 
      message: 'Galaxias obtenidas correctamente',
    };
  }

  @Get('categoria/:categoriaId')
  @ApiOperation({ 
    summary: 'Obtener galaxias por categoría formateadas para motor 3D',
    description: 'Endpoint específico para el repositorio 3D React. Devuelve galaxias en formato array [x,y,z] para Three.js'
  })
  @ApiParam({ name: 'categoriaId', description: 'ID de la categoría', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Galaxias obtenidas correctamente',
    type: GalaxiasPorCategoriaResponseDto
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async findByCategoriaFor3D(@Param('categoriaId', ParseObjectIdPipe) categoriaId: string) {
    
    const paginationParams: GalaxiaPaginationDto = {
      categoriaId: categoriaId,
      page: 1,   
      limit: 100   
    };

    const result = await this.getGalaxiasByCategoriaFor3DUseCase.execute(paginationParams);
    
    if (result.isFailure) {
      const errorStatus = (result.error as { status?: number }).status || HttpStatus.NOT_FOUND;
      throw new HttpException(
        result.error.message, 
        errorStatus
      );
    }

    return {
      data: result.getValue(), 
      message: 'Galaxias obtenidas para motor 3D',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una galaxia por ID' })
  @ApiParam({ name: 'id', description: 'ID de la galaxia', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Galaxia obtenida correctamente',
    type: Galaxia3DResponseDto
  })
  @ApiResponse({ status: 404, description: 'Galaxia no encontrada' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneGalaxiaUseCase.execute(id);
    if (result.isFailure) {
      const status = (result.error as { status?: number }).status || HttpStatus.NOT_FOUND;
      throw new HttpException(result.error.message, status);
    }
    return {
      data: result.getValue(), 
      message: 'Galaxia obtenida correctamente',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una galaxia' })
  @ApiParam({ name: 'id', description: 'ID de la galaxia', type: String })
  @ApiBody({ type: UpdateGalaxiaDto })
  @ApiResponse({ status: 200, description: 'Galaxia actualizada correctamente' })
  @ApiResponse({ status: 404, description: 'Galaxia no encontrada' })
  @ApiResponse({ status: 400, description: 'Error al actualizar la galaxia' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateGalaxiaDto: UpdateGalaxiaDto,
  ) {
    const result = await this.updateGalaxiaUseCase.execute(id, updateGalaxiaDto);
    if (result.isFailure) {
       const status = (result.error as { status?: number }).status || HttpStatus.BAD_REQUEST;
      throw new HttpException(result.error.message, status);
    }
    return {
      data: result.getValue(), 
      message: 'Galaxia actualizada correctamente',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una galaxia' })
  @ApiParam({ name: 'id', description: 'ID de la galaxia', type: String })
  @ApiResponse({ status: 200, description: 'Galaxia eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Galaxia no encontrada' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteGalaxiaUseCase.execute(id);
    if (result.isFailure) {
       const status = (result.error as { status?: number }).status || HttpStatus.NOT_FOUND;
      throw new HttpException(result.error.message, status);
    }
    return {
      data: result.getValue(),
      message: 'Galaxia eliminada correctamente',
    };
  }

  decodeBase64Image(base64String: string): {
    buffer: Buffer;
    mimetype: string;
    extension: string;
  } {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 string');
    }
    const mimetype = matches[1];
    const extension = mimetype.split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');
    return { buffer, mimetype, extension };
  }
}