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
import { ApiTags } from '@nestjs/swagger';
import { ValidateGalaxia } from './shared/decorators/validate-galaxia.decorator';
import { IsGalaxiaExist } from './shared/decorators/is-galaxia-exist.decorator';

@ApiTags('galaxias')
@Controller('galaxias')
export class GalaxiasController {
  constructor(private readonly galaxiasService: GalaxiasService) { }

  @Post()
  create(@Body() @ValidateGalaxia() createGalaxiaDto: CreateGalaxiaDto) {
    return this.galaxiasService.create(createGalaxiaDto);
  }

  @Get()
  findAll() {
    return this.galaxiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string, @IsGalaxiaExist() validated: any) {
    return this.galaxiasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() @ValidateGalaxia() updateGalaxiaDto: UpdateGalaxiaDto,
  ) {
    return this.galaxiasService.update(id, updateGalaxiaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string, @IsGalaxiaExist() validated: any) {
    return this.galaxiasService.remove(id);
  }
}
