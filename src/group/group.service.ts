import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import { UpdateGroupDto } from './dto/update-group.dto'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { SpaceMembersService } from 'src/space-members/space-members.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    private spaceMembersService: SpaceMembersService,
  ) {}

  // Pulbic영역
  async createGroup(spaceId: number, name) {
    const group = this.groupRepository.create({ space_id: spaceId, name });
    try {
      await this.groupRepository.save(group);
      return { code: 200, message: '성공적으로 그룹을 생성하였습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async deleteGroupById(groupId: number) {
    const group = await this.findGroupById(groupId);
    this.isExistingGroup(group);
    this.groupRepository.delete(groupId);
  }

  async findAllGroupBySpaceId(spaceId: number, userId: number) {
    await this.spaceMembersService.roleCheck(spaceId, userId);
    const results = await this.groupRepository.findBy({ space_id: spaceId });
    console.log('특정 스페이스 모든 그룹 조회 ===>', results);
    // this.isExistingGroup(results[0]);
    return results;
  }

  // Private영역
  // Checker
  private isExistingGroup(group: Group) {
    if (!group) {
      throw new NotFoundException('해당하는 그룹이 존재하지 않습니다.');
    }
  }

  // DB func
  private async findGroupById(groupId: number) {
    try {
      const result = await this.groupRepository.findOneBy({ id: groupId });
      return result;
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }
}
