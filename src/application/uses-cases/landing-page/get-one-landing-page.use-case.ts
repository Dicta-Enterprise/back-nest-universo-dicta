import { Injectable } from '@nestjs/common';
import { LandingPageService } from "src/core/services/landing-page/landing-page.service";

@Injectable()
export class GetOneLandingPageUseCase {
  constructor(private readonly landingPageService: LandingPageService) {}

  async execute(id: string) {
    return this.landingPageService.findOne(id);
  }
}
