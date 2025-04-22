import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanetasService } from '../../../core/services/planeta/planetas.service';
import { CreatePlanetaDto } from 'src/application/dto/planeta/create-planeta.dto';
import { UpdatePlanetaDto } from 'src/application/dto/planeta/update-planeta.dto';

@Controller('planetas')
export class PlanetasController {
  constructor(private readonly planetasService: PlanetasService) {}

  @Post()
  create(@Body() createPlanetaDto: CreatePlanetaDto) {
    return this.planetasService.create(createPlanetaDto);
  }

  @Get()
  findAll() {
    return this.planetasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planetasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanetaDto: UpdatePlanetaDto) {
    return this.planetasService.update(+id, updatePlanetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planetasService.remove(+id);
  }
}
