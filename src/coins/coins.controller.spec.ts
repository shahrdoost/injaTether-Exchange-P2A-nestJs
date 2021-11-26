import { Test, TestingModule } from '@nestjs/testing';
import { CoinsController } from './coins.controller';

describe('CoinsController', () => {
  let controller: CoinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoinsController],
    }).compile();

    controller = module.get<CoinsController>(CoinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
