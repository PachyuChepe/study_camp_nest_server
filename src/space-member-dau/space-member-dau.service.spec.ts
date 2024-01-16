import { Test, TestingModule } from '@nestjs/testing';
import { SpaceMemberDauService } from './space-member-dau.service';

describe('SpaceMemberDauService', () => {
  let service: SpaceMemberDauService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceMemberDauService],
    }).compile();

    service = module.get<SpaceMemberDauService>(SpaceMemberDauService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
