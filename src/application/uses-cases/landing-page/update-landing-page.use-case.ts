import { Injectable } from '@nestjs/common';
import { UpdateLandingPageDto } from 'src/application/dto/lading-page/update-landing-page.dto';
import { LandingPageService } from "src/core/services/landing-page/landing-page.service";


@Injectable()
export class UpdateLandingPageUseCase {
  constructor(private readonly landingPageService: LandingPageService) {}

  async execute(id: string, dto: UpdateLandingPageDto) {
    return this.landingPageService.update(id, dto);
  }
}
