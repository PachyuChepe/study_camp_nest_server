import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-members.entity';
import { Repository } from 'typeorm';
import { SpaceMembersService } from 'src/space-members/space-members.service';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(GroupMember)
    private groupMembersRepository: Repository<GroupMember>,
    private spaceMembersService: SpaceMembersService,
  ) {}

  // Public영역
  async addGroupMember(groupId: number, memberId: number) {
    const exGroupMember = await this.findGroupMemberByGroupIdAndMemberId(
      groupId,
      memberId,
    );
    this.isNotExistinngGroupMember(exGroupMember);
    const groupMember = this.groupMembersRepository.create({
      group_id: groupId,
      member_id: memberId,
    });
    try {
      await this.groupMembersRepository.save(groupMember);
      return { code: 200, message: '성공적으로 그룹에 멤버를 추가하였습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async deleteGroupMember(groupId: number, memberId: number) {
    const exGroupMember = await this.findGroupMemberByGroupIdAndMemberId(
      groupId,
      memberId,
    );
    this.isExistingGroupMember(exGroupMember);
    try {
      await this.groupMembersRepository.delete(exGroupMember.id);
      return {
        code: 200,
        message: '성공적으로 그룹에서 멤버를 추방하였습니다.',
      };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  // 특정 스페이스에 속한 모든 그룹 사용자 조회
  // 리팩토링 한거
  async getGroupUsers(spaceId: number, userId: number) {
    // 특정 스페이스에 속한 모든 그룹 멤버의 ID를 가져옵니다.
    const groupMemberIds = (
      await this.spaceMembersService.getSpaceMemberIdBySpaceId(spaceId, userId)
    ).map((data) => data.id);
    if (groupMemberIds.length === 0) {
      throw new NotFoundException('등록된 멤버가 없습니다.');
    }
    console.log('그룹멤버아이디스', groupMemberIds);

    // groupMemberIds 배열을 사용하여 모든 관련 데이터를 한 번의 쿼리로 가져옵니다.
    const groupMembersData = await this.groupMembersRepository
      .createQueryBuilder('groupMember')
      .leftJoinAndSelect('groupMember.group', 'group')
      .leftJoinAndSelect('groupMember.space_member', 'spaceMember')
      .leftJoinAndSelect('spaceMember.user', 'user')
      .where('groupMember.member_id IN (:...groupMemberIds)', {
        groupMemberIds,
      })
      .getMany();
    console.log('그룹멤버데이터', groupMembersData);

    // 결과 데이터를 원하는 구조로 변환합니다.
    const groupMembers = groupMembersData.map((data) => ({
      userId: data.space_member.user.id,
      nickName: data.space_member.user.nick_name,
      groupName: data.group.name,
      groupId: data.group.id,
      memberId: data.member_id,
    }));

    return groupMembers;
  }

  async getMembersByGroupId(groupId: number) {
    const members = await this.groupMembersRepository.find({
      where: { group_id: groupId },
    });

    if (!members) {
      throw new NotFoundException(
        '해당 그룹에 등록된 멤버가 존재하지 않습니다.',
      );
    }

    return members;
  }
  // Private영역
  // #checker
  // TODO 타입스크립트 오버로딩을 이용해보자.
  // TODO true false만 주도록 해보자.
  // TODO 애초에 이렇게 할 필요가 없었네 슬프다.
  // TODO 이걸보면서 리팩토링 해보자.
  private isNotExistinngGroupMember(groupMember: GroupMember) {
    if (groupMember) {
      throw new NotFoundException(
        '해당하는 그룹에 멤버가 이미 등록되어 있습니다.',
      );
    }
  }

  private isExistingGroupMember(groupmember: GroupMember) {
    if (!groupmember) {
      throw new NotFoundException('해당하는 그룹 멤버가 존재하지 않습니다.');
    }
  }

  // DB func
  private async findGroupMemberByGroupIdAndMemberId(
    groupId: number,
    memberId: number,
  ) {
    const groupMember = await this.groupMembersRepository.findOneBy({
      group_id: groupId,
      member_id: memberId,
    });
    return groupMember;
  }
}
