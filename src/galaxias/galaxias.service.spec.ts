import { Test, TestingModule } from '@nestjs/testing';
import { GalaxiasService } from './galaxias.service';

describe('GalaxiasService', () => {
  let service: GalaxiasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GalaxiasService],
    }).compile();

    service = module.get<GalaxiasService>(GalaxiasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
