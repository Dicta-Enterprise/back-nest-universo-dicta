import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';
import { LandingPageService } from 'src/core/services/landing-page/landing-page.service';
import { Result } from 'src/shared/domain/result/result';

export interface LandingPageQueryFilters {
  planetaId?: string;
  galaxiaId?: string;
  categoriaId?: string;
}

@Injectable()
export class GetAllLandingPageUseCase {
  constructor(
    private readonly landingPageService: LandingPageService,
    private readonly eventEmitter: EventEmitter2, 
  ) {}

  async execute(filters?: LandingPageQueryFilters): Promise<Result<LandingPage[]>> {
    try {
      const landingPages = await this.landingPageService.findAll(filters);
      
      return Result.okList(landingPages);
    } catch (error) {
      const errorReal = error instanceof Error ? error : new Error(String(error));
      return Result.fail(errorReal);
    }
  }
}
