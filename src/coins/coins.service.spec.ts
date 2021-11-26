import { Test, TestingModule } from '@nestjs/testing';
import { CoinsService } from './coins.service';

describe('CoinsService', () => {
  let service: CoinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinsService],
    }).compile();

    service = module.get<CoinsService>(CoinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
