import { Body, Controller, Get, Post } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { CreateLandingPageDto } from './dto/create-landing-page.dto';

@Controller('landing-page')
export class LandingPageController {

    constructor(
        private readonly landingPageService: LandingPageService
    ) { }


    // Atributos a considerar , conectar bd - LISTOP
    @Post()
    create(@Body() createLandingPageDto: CreateLandingPageDto) {
        return this.landingPageService.create(createLandingPageDto);
    }

    @Get()
    findAll() {
        return this.landingPageService.findAll();
    }
}
