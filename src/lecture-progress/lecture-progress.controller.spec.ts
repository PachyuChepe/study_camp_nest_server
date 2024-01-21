import { Test, TestingModule } from '@nestjs/testing';
import { LectureProgressController } from './lecture-progress.controller';

describe('LectureProgressController', () => {
  let controller: LectureProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureProgressController],
    }).compile();

    controller = module.get<LectureProgressController>(
      LectureProgressController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
