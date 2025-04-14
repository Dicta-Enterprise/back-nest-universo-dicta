import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GalaxiasService } from '../../../core/services/galaxia/galaxias.service';

import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { CreateGalaxiaDto } from 'src/application/dto/galaxia/create-galaxia.dto';
import { UpdateGalaxiaDto } from 'src/application/dto/galaxia/update-galaxia.dto';

@Controller('galaxias')
export class GalaxiasController {
  constructor(private readonly galaxiasService: GalaxiasService) {}

  @Post()
  create(@Body() createGalaxiaDto: CreateGalaxiaDto) {
    return this.galaxiasService.create(createGalaxiaDto);
  }

  @Get()
  findAll() {
    return this.galaxiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.galaxiasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateGalaxiaDto: UpdateGalaxiaDto,
  ) {
    return this.galaxiasService.update(id, updateGalaxiaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.galaxiasService.remove(id);
  }
}
