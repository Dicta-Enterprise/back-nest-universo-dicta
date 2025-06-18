import { Injectable } from '@nestjs/common';
import { LandingPageService } from "src/core/services/landing-page/landing-page.service";

@Injectable()
export class GetAllLandingPageUseCase {
  constructor(private readonly landingPageService: LandingPageService) {}

  async execute() {
    return this.landingPageService.findAll();
  }
}
