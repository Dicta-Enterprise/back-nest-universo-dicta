import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GalaxiasService } from './galaxias.service';
import { CreateGalaxiaDto } from './dto/create-galaxia.dto';
import { UpdateGalaxiaDto } from './dto/update-galaxia.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';

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
