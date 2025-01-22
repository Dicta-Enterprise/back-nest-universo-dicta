import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { CreateLandingPageDto } from './dto/create-landing-page.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse-object-id.pipe';
import { UpdateLandingPageDto } from './dto/update-landing-page';

@Controller('landing-page')
export class LandingPageController {

    constructor(
        private readonly landingPageService: LandingPageService
    ) { }

    @Post()
    create(@Body() createLandingPageDto: CreateLandingPageDto) {
        return this.landingPageService.create(createLandingPageDto);
    }

    @Get()
    findAll() {
        return this.landingPageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseObjectIdPipe) id: string) {
        return this.landingPageService.finOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseObjectIdPipe) id:string,
        @Body() updateLandingPageDto:UpdateLandingPageDto,
    ) {
        return this.landingPageService.update(id,updateLandingPageDto)
    }
}
