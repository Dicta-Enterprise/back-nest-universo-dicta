import { Injectable } from '@nestjs/common';
import { CreateLandingPageDto } from 'src/application/dto/lading-page/create-landing-page.dto';
import { LandingPageService } from 'src/core/services/landing-page/landing-page.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Result } from 'src/shared/domain/result/result';
import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';
import { LandingPageEvent } from 'src/domain/events/landing-page/landing-page-creada.event';  


@Injectable()
export class CreateLandingPageUseCase {
  constructor(
    private readonly landingPageService: LandingPageService,
    private readonly eventEmitter: EventEmitter2, // Si necesitas emitir eventos
  ) {}

  async execute(
    dto: CreateLandingPageDto,
  ): Promise<Result<LandingPage>> {

    try {
      const landingPage = await this.landingPageService.create(dto);

      this.eventEmitter.emit(
        'landingPage.created',
        new LandingPageEvent(landingPage),
      );

      return Result.ok(landingPage);

    } catch (error) {
      return Result.fail(error);
    }
  }
}
