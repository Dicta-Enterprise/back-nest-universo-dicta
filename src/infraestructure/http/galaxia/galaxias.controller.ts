import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';
import * as useCase from 'src/application/uses-cases/galaxias';
import * as azureCase from 'src/application/uses-cases/azure';
import { randomUUID } from 'crypto';
import { createFakeMulterFileAdapter } from 'src/application/adapters/buffer-file.adapter';
@Controller('galaxias')
export class GalaxiasController {
  constructor(
    private readonly getAllGalaxiaUseCase: useCase.GetAllGalaxiaUseCase,
    private readonly createUseCase: useCase.CreateGalaxiaUseCase,
    private readonly getOneGalaxiaUseCase: useCase.GetOneGalaxiaUseCase,
    private readonly updateGalaxiaUseCase: useCase.ActualizarGalaxiaCasoDeUso,
    private readonly deleteGalaxiaUseCase: useCase.DeleteGalaxiaUseCase,
     private readonly saveImageStorageUseCase: azureCase.SaveImageStorageUseCase,

  ) { }


@Post()
async create(@Body() createGalaxiaDto: CreateGalaxiaDto) {
  if (createGalaxiaDto.imagen?.startsWith('data:')) {
    const { buffer, mimetype, extension } = this.decodeBase64Image(createGalaxiaDto.imagen);
    const filename = `${randomUUID()}.${extension}`;
    const fakeFile = createFakeMulterFileAdapter(buffer, filename, mimetype);

    const uploadResult = await this.saveImageStorageUseCase.execute(fakeFile, 'galaxias');

    if (uploadResult.isFailure) {
      throw new HttpException(uploadResult.error.message, HttpStatus.BAD_REQUEST);
    }

    createGalaxiaDto.imagen = uploadResult.getValue(); // Reemplaza Base64 por URL
  }

  const result = await this.createUseCase.execute(createGalaxiaDto);

  if (result.isFailure) {
    throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
  }

  return {
    data: result,
    message: 'Galaxia creada',
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
    const extension = mimetype.split('/')[1]; // Ej: 'jpeg', 'png'
    const buffer = Buffer.from(matches[2], 'base64');

    return { buffer, mimetype, extension };
  }

  @Get()
  async findAll() {
    const result = await this.getAllGalaxiaUseCase.execute();

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result,
      message: 'Galaxias obtenidas',
    };
  }

  @Get(':id')
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
      message: 'Galaxia ACtulizado',
    };
  }

  @Delete(':id')
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
