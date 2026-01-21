import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';
import { LandingPageService } from 'src/core/services/landing-page/landing-page.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetAllLandingPageUseCase {
  constructor(
    private readonly landingPageService: LandingPageService,
    private readonly eventEmitter: EventEmitter2, // Si necesitas emitir eventos
  ) {}

  async execute(): Promise<Result<LandingPage[]>> {
    try {
      const landingPages = await this.landingPageService.findAll();
      
      return Result.okList(landingPages);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
