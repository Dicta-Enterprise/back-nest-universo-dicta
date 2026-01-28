import { Module } from '@nestjs/common';
import { LandingPageController } from './landing-page.controller';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';

import { LANDING_PAGE_REPOSITORY } from 'src/core/constants/constants';
import { LandingPagePrismaRepository } from 'src/infraestructure/persistence/landing-page/landing-page.prisma.repository';
import { LandingPageService } from 'src/core/services/landing-page/landing-page.service';

import { CreateLandingPageUseCase } from 'src/application/uses-cases/landing-page/create-landing-page.use-case';
import { GetAllLandingPageUseCase } from 'src/application/uses-cases/landing-page/get-all-landing-page.use-case';
import { GetOneLandingPageUseCase } from 'src/application/uses-cases/landing-page/get-one-landing-page.use-case';
import { UpdateLandingPageUseCase } from 'src/application/uses-cases/landing-page/update-landing-page.use-case';
import { DeleteLandingPageUseCase } from 'src/application/uses-cases/landing-page/delete-landing-page.use-case';
import { LANDING_PAGE_FACTORY } from '@constants/factories';
import { DefaultLandingPageFactory } from 'src/core/fabricas/landing-page/landing-page.factory';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [LandingPageController],
  providers: [
    {
      provide: LANDING_PAGE_REPOSITORY,
      useClass: LandingPagePrismaRepository,
    },
    {
      provide: LANDING_PAGE_FACTORY,
      useClass: DefaultLandingPageFactory,
    },
    LandingPageService,
    CreateLandingPageUseCase,
    GetAllLandingPageUseCase,
    GetOneLandingPageUseCase,
    UpdateLandingPageUseCase,
    DeleteLandingPageUseCase,
  ],
  exports: [LandingPageService],
})
export class LandingPageModule {}
