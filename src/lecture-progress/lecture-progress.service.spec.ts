import { Test, TestingModule } from '@nestjs/testing';
import { LectureProgressService } from './lecture-progress.service';

describe('LectureProgressService', () => {
  let service: LectureProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectureProgressService],
    }).compile();

    service = module.get<LectureProgressService>(LectureProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
