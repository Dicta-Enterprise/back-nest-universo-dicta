import { Test, TestingModule } from '@nestjs/testing';
import { GalaxiasController } from './galaxias.controller';
import { GalaxiasService } from './galaxias.service';

describe('GalaxiasController', () => {
  let controller: GalaxiasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalaxiasController],
      providers: [GalaxiasService],
    }).compile();

    controller = module.get<GalaxiasController>(GalaxiasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
