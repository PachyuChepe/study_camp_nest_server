import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
  ) {}

  //Pulbic영역
  async createGroup(spaceId: number, name) {
    let group = this.groupRepository.create({ space_id: spaceId, name });
    try {
      await this.groupRepository.save(group);
      return { code: 200, message: '성공적으로 그룹을 생성하였습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async deleteGroupById(groupId: number) {
    let group = await this.findGroupById(groupId);
    this.isExistingGroup(group)
    this.groupRepository.delete(group)
  }

  async findAllGroupBySpaceId(spaceId: number) {
    let results = await this.groupRepository.findBy({space_id: spaceId});
    this.isExistingGroup(results[0]);
    return results
  }

  //Private영역
  //Checker
  private isExistingGroup(group: Group){
    if(!group){
      throw new NotFoundException('해당하는 그룹이 존재하지 않습니다.')
    }
  }


  //DB func
  private async findGroupById(groupId: number) {
    try {
      let result = await this.groupRepository.findOneBy({ id: groupId });
      return result;
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }
}
