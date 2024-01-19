import { Test, TestingModule } from '@nestjs/testing';
import { SpaceMemberDauController } from './space-member-dau.controller';

describe('SpaceMemberDauController', () => {
  let controller: SpaceMemberDauController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceMemberDauController],
    }).compile();

    controller = module.get<SpaceMemberDauController>(SpaceMemberDauController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
