import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitorsController } from './exhibitors.controller';
import { ExhibitorsService } from './exhibitors.service';

describe('ExhibitorsController', () => {
  let controller: ExhibitorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExhibitorsController],
      providers: [ExhibitorsService],
    }).compile();

    controller = module.get<ExhibitorsController>(ExhibitorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
