import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-members.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(GroupMember)
    private groupMembersRepository: Repository<GroupMember>,
  ) {}

  //Public영역
  async addGroupMember(groupId: number, memberId: number) {
    let exGroupMember = await this.findGroupMemberByGroupIdAndMemberId(groupId, memberId);
    this.isNotExistinngGroupMember(exGroupMember);
    let groupMember = this.groupMembersRepository.create({ group_id: groupId, member_id: memberId })
    try {
      await this.groupMembersRepository.save(groupMember)
      return { code: 200, message: '성공적으로 그룹에 멤버를 추가하였습니다.'}
    } catch(error) {
      throw new InternalServerErrorException('서버 오류 발생')
    }
  }

  async deleteGroupMember(groupId: number, memberId: number){
    let exGroupMember = await this.findGroupMemberByGroupIdAndMemberId(groupId, memberId);
    this.isExistingGroupMember(exGroupMember);
    try{
      await this.groupMembersRepository.delete(exGroupMember)
      return { code: 200, message: '성공적으로 그룹에서 멤버를 추방하였습니다.'}
    } catch(error){
      throw new InternalServerErrorException('서버 오류 발생')
    }
  }

  //Private영역
  //#checker
  //TODO 타입스크립트 오버로딩을 이용해보자.
  //TODO true false만 주도록 해보자.
  //TODO 애초에 이렇게 할 필요가 없었네 슬프다.
  //TODO 이걸보면서 리팩토링 해보자.
  private isNotExistinngGroupMember(groupMember: GroupMember){
    if(groupMember){
      throw new NotFoundException('해당하는 그룹에 멤버가 이미 등록되어 있습니다.')
    }
  }

  private isExistingGroupMember(groupmember: GroupMember){
    if(!groupmember){
      throw new NotFoundException('해당하는 그룹 멤버가 존재하지 않습니다.')
    }
  }


  //DB func
  private async findGroupMemberByGroupIdAndMemberId (groupId:number ,memberId: number){
    let groupMember = await this.groupMembersRepository.findOneBy({group_id: groupId ,member_id: memberId})
    return groupMember;
  }
}
