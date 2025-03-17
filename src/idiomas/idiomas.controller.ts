import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { IdiomasService } from './idiomas.service';
import { CreateIdiomaDto } from './dto/create-idioma.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { UpdateIdiomaDto } from './dto/update-idioma.dto';

@Controller('idiomas')
export class IdiomasController {

    constructor(
        private readonly idiomasService: IdiomasService
    ) { }

    @Post()
    create(@Body() createIdiomaDto: CreateIdiomaDto) {
        return this.idiomasService.create(createIdiomaDto);
    }

    @Get()
    findAll() {
        return this.idiomasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseObjectIdPipe) id: string,) {
        return this.idiomasService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() updateIdiomaDto: UpdateIdiomaDto,
    ) {
        return this.idiomasService.update(id, updateIdiomaDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseObjectIdPipe) id: string,) {
        return this.idiomasService.remove(id);
    }


}
