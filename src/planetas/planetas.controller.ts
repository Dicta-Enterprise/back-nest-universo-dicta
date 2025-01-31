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

@Controller('planetas')
export class PlanetasController {
  constructor(private readonly planetasService: PlanetasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPlanetaDto: CreatePlanetaDto) {
    return this.planetasService.create(createPlanetaDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.planetasService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.planetasService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePlanetaDto: UpdatePlanetaDto,
  ) {
    return this.planetasService.update(id, updatePlanetaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.planetasService.remove(id);
  }
}
