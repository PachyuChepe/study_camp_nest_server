import { Test, TestingModule } from '@nestjs/testing';
import { LectureItemsController } from './lecture-items.controller';

describe('LectureItemsController', () => {
  let controller: LectureItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureItemsController],
    }).compile();

    controller = module.get<LectureItemsController>(LectureItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
