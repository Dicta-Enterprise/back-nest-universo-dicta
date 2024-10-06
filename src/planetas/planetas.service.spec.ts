import { Test, TestingModule } from '@nestjs/testing';
import { PlanetasService } from './planetas.service';

describe('PlanetasService', () => {
  let service: PlanetasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanetasService],
    }).compile();

    service = module.get<PlanetasService>(PlanetasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
