import { Injectable } from '@nestjs/common';
import { CreateLandingPageDto } from 'src/application/dto/lading-page/create-landing-page.dto';
import { LandingPageService } from "src/core/services/landing-page/landing-page.service";

@Injectable()
export class CreateLandingPageUseCase {
  constructor(private readonly landingPageService: LandingPageService) {}

  async execute(dto: CreateLandingPageDto) {
    return this.landingPageService.create(dto);
  }
}
