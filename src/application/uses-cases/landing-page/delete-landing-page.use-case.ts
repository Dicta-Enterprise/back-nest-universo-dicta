import { Injectable } from '@nestjs/common';
import { LandingPageService } from "src/core/services/landing-page/landing-page.service";

@Injectable()
export class DeleteLandingPageUseCase {
  constructor(private readonly landingPageService: LandingPageService) {}

  async execute(id: string) {
    return this.landingPageService.remove(id);
  }
}
