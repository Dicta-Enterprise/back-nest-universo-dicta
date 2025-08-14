import { Injectable } from '@nestjs/common';
import { UpdateLandingPageDto } from 'src/application/dto/lading-page/update-landing-page.dto';
import { LandingPageService } from "src/core/services/landing-page/landing-page.service";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';
import { Result } from 'src/shared/domain/result/result';
import { LandingPageEvent } from 'src/domain/events/landing-page/landing-page-creada.event';


@Injectable()
export class UpdateLandingPageUseCase {
  constructor(
    private readonly landingPageService: LandingPageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    id: string,
    dto: UpdateLandingPageDto,
  ): Promise<Result<LandingPage>> {
    try {
      const landingPage = await this.landingPageService.update(
        id,
        dto,
      );
      this.eventEmitter.emit('landing-page.update', new LandingPageEvent(landingPage));
      return Result.ok(landingPage);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
