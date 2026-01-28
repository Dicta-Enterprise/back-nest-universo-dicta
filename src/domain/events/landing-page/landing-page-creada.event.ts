import { LandingPage } from 'src/core/entities/landing-page/landing-page.entity';
import { IDomainEvent } from 'src/shared/domain/events/domain-event.interface';



export class LandingPageEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly landingPage: LandingPage;

  constructor(landingPage: LandingPage) {
    this.dateTimeOccurred = new Date();
    this.landingPage = landingPage;
  }

  public getAggregateId(): string {
    return this.landingPage.id;
  }
}