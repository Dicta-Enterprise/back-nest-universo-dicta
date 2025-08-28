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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GalaxiaPaginationDto } from 'src/application/dto/galaxia';

import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { CreateMultipleGalaxiasDto } from 'src/application/dto/galaxia/create-multiple-galaxias.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import * as azureCase from 'src/application/uses-cases/azure';
import * as useCase from 'src/application/uses-cases/galaxias';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

@ApiTags('Galaxias')
@Controller('galaxias')
export class GalaxiasController {
  constructor(
    private readonly getAllGalaxiaUseCase: useCase.GetAllGalaxiaUseCase,
    private readonly createUseCase: useCase.CreateGalaxiaUseCase,
    private readonly createMultipleGalaxiasUseCase: useCase.CreateMultipleGalaxiasUseCase, // ← Nuevo

    private readonly getOneGalaxiaUseCase: useCase.GetOneGalaxiaUseCase,
    private readonly updateGalaxiaUseCase: useCase.ActualizarGalaxiaCasoDeUso,
    private readonly deleteGalaxiaUseCase: useCase.DeleteGalaxiaUseCase,
    private readonly saveImageStorageUseCase: azureCase.SaveImageStorageUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva galaxia' })
  @ApiBody({
    type: CreateGalaxiaDto,
    description: 'Datos para crear la galaxia',
  })
  @ApiResponse({ status: 201, description: 'Galaxia creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  async create(@Body() createGalaxiaDto: CreateGalaxiaDto) {
    const result = await this.createUseCase.execute(createGalaxiaDto);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result,
      message: 'Galaxia creada',
    };
  }
  @Post('multiple')
  @ApiOperation({
    summary: 'Crear múltiples galaxias con datos base compartidos',
  })
  @ApiBody({
    type: CreateMultipleGalaxiasDto,
    description:
      'Datos para crear múltiples galaxias con información base compartida',
    examples: {
      ejemplo1: {
        summary: 'Múltiples galaxias de Salud Social',
        value: {
          nombre: 'Salud Social',
          descripcion: 'Galaxia sobre relaciones interpersonales y comunidad',
          galaxias: [
            {
              categoriaId: '689e130abb9772d4bb7b983f',
              imagen: null,
              url: 'https://example.com/salud-social',
              textura: 'salud-social-textura.png',
              color: '#FE797B',
              posicion: {
                x: -13,
                y: 1,
                z: 3,
              },
              rotacion: {
                x: 1.847995880179171,
                y: 0,
                z: 5,
              },
            },
            {
              categoriaId: '689e35179ea8c5a0572ee845',
              imagen: null,
              url: 'https://example.com/salud-social-2',
              textura: 'salud-social-textura-2.png',
              color: '#FE797B',
              posicion: {
                x: -10,
                y: 2,
                z: 4,
              },
              rotacion: {
                x: 1.847995880179171,
                y: 0,
                z: 5,
              },
            },
            {
              categoriaId: '689e12c5bb9772d4bb7b983e',
              imagen: null,
              url: 'https://example.com/salud-social-2',
              textura: 'salud-social-textura-2.png',
              color: '#FE797B',
              posicion: {
                x: -10,
                y: 2,
                z: 4,
              },
              rotacion: {
                x: 1.847995880179171,
                y: 0,
                z: 5,
              },
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Galaxias creadas exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados' })
  async createMultiple(
    @Body() createMultipleGalaxiasDto: CreateMultipleGalaxiasDto,
  ) {
    const result = await this.createMultipleGalaxiasUseCase.execute(
      createMultipleGalaxiasDto,
    );
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result,
      message: `${result} galaxias creadas exitosamente`,
    };
  }
  /**
   * Decodifica una imagen en Base64 a buffer y metadatos.
   * @param base64String Imagen en formato Base64 (data:image/...;base64,...)
   */
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

  @Get()
  @ApiOperation({ summary: 'Obtener todas las galaxias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de galaxias obtenida correctamente',
  })
  @ApiResponse({ status: 400, description: 'Error al obtener las galaxias' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página para la paginación',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de resultados por página',
    example: 10,
  })
  @ApiQuery({
    name: 'categoriaId',
    required: false,
    type: String,
    description:
      'ID de la categoría para filtrar galaxias (ObjectId de MongoDB)',
    example: '64e4d67c9f1b1468a8f6c7d2',
  })
  async findAll(@Query() galaxiaPaginationDto: GalaxiaPaginationDto) {
    const result =
      await this.getAllGalaxiaUseCase.execute(galaxiaPaginationDto);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result,
      message: 'Galaxias obtenidas',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una galaxia por ID' })
  @ApiParam({ name: 'id', description: 'ID de la galaxia', type: String })
  @ApiResponse({ status: 200, description: 'Galaxia obtenida correctamente' })
  @ApiResponse({ status: 400, description: 'Error al obtener la galaxia' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.getOneGalaxiaUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result,
      message: 'Galaxia obtenida',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una galaxia' })
  @ApiParam({ name: 'id', description: 'ID de la galaxia', type: String })
  @ApiBody({
    type: UpdateGalaxiaDto,
    description: 'Datos para actualizar la galaxia',
  })
  @ApiResponse({
    status: 200,
    description: 'Galaxia actualizada correctamente',
  })
  @ApiResponse({ status: 400, description: 'Error al actualizar la galaxia' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateGalaxiaDto: UpdateGalaxiaDto,
  ) {
    const result = await this.updateGalaxiaUseCase.execute(
      id,
      updateGalaxiaDto,
    );
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result,
      message: 'Galaxia actualizada',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una galaxia' })
  @ApiParam({ name: 'id', description: 'ID de la galaxia', type: String })
  @ApiResponse({ status: 200, description: 'Galaxia eliminada correctamente' })
  @ApiResponse({ status: 400, description: 'Error al eliminar la galaxia' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.deleteGalaxiaUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: result,
      message: 'Galaxia eliminada',
    };
  }
}
