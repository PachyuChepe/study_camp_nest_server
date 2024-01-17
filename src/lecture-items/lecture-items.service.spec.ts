import { Test, TestingModule } from '@nestjs/testing';
import { LectureItemsService } from './lecture-items.service';

describe('LectureItemsService', () => {
  let service: LectureItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectureItemsService],
    }).compile();

    service = module.get<LectureItemsService>(LectureItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
