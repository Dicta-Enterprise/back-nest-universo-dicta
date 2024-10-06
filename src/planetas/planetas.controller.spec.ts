import { Test, TestingModule } from '@nestjs/testing';
import { PlanetasController } from './planetas.controller';
import { PlanetasService } from './planetas.service';

describe('PlanetasController', () => {
  let controller: PlanetasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetasController],
      providers: [PlanetasService],
    }).compile();

    controller = module.get<PlanetasController>(PlanetasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
