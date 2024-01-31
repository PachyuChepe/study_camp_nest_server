import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// import { CreateSpaceMemberDto } from './dto/create-space-member.dto'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
// import { UpdateSpaceMemberDto } from './dto/update-space-member.dto'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceMember } from './entities/space-member.entity';
import { Repository } from 'typeorm';
import { SpaceMemberRole } from './types/space-member-role.type';
import { AddMemberInSpaceDto } from './dto/add-member-in-space.dto';
import { DeleteMemberInSpaceDto } from './dto/delete-member-in-space.dto';
import { Space } from '../spaces/entities/space.entity';
import { ChangeMemberRoleDto } from './dto/change-member-role.dto ';

@Injectable()
export class SpaceMembersService {
  constructor(
    @InjectRepository(SpaceMember)
    private spaceMemberRepository: Repository<SpaceMember>,

    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
  ) {}

  // Public 영역
  // 흐름: 학습공간을 찾는다.(Space에서 이루어져야 함.) -> 유저를 생성한다.(여기서) create와 save-> 유저를 학습공간에 넣는다.(Space에서)
  // TODO: Role는 어떻게 확인할거냐? 참 생각할거 많네.
  // 학습공간의 멤버를 생성합니다. 유저 정보와 학습 공간 스펙은 현 서비스에서 다루는게 옳지 않다고 생각해 이를 이용하는 모듈에 값을 리턴합니다.

  // async addMemberInSpace(addMemberInSpaceDto: AddMemberInSpaceDto) {
  //   let exUser = await this.findUserById(addMemberInSpaceDto.userId)
  //   if(exUser){
  //     throw new BadRequestException("이미 방에 참여하고 있는 유저입니다.");
  //   }
  //   let member = this.spaceMemberRepository.create( {user_id: addMemberInSpaceDto.userId, space_id: addMemberInSpaceDto.spaceId, role: SpaceMemberRole.Mentee})
  //   try{
  //     await this.spaceMemberRepository.save(member);
  //     return {code: 200, message: "해당 방에 유저를 초대하는데 성공했습니다."}
  //   } catch(error){
  //     throw new InternalServerErrorException('서버 오류 발생');
  //   }
  // };

  async addMemberInSpace(addMemberInSpaceDto: AddMemberInSpaceDto) {
    // 특정 스페이스에 특정 유저가 이미 있는지 확인
    const existingMember = await this.spaceMemberRepository.findOne({
      where: {
        user_id: addMemberInSpaceDto.userId,
        space_id: addMemberInSpaceDto.spaceId,
      },
    });

    if (existingMember) {
      throw new BadRequestException(
        '이미 해당 스페이스에 참여하고 있는 유저입니다.',
      );
    }

    const member = this.spaceMemberRepository.create({
      user_id: addMemberInSpaceDto.userId,
      space_id: addMemberInSpaceDto.spaceId,
      role: SpaceMemberRole.Mentee,
    });

    try {
      await this.spaceMemberRepository.save(member);
      return {
        code: 200,
        message: '해당 스페이스에 유저를 초대하는데 성공했습니다.',
      };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async getMemberInSpace(getMemberInSpaceDto, userId) {
    try {
      const member = await this.spaceMemberRepository.findOne({
        where: { space_id: getMemberInSpaceDto.spaceId, user_id: userId },
      });
      if (!member) {
        throw new NotFoundException('해당 스페이스 멤버가 존재하지 않습니다.');
      }
      return member;
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async getAllMembersInSpace(spaceId: number) {
    const members = this.spaceMemberRepository
      .createQueryBuilder('spaceMember')
      .leftJoinAndSelect('spaceMember.user', 'user')
      .select([
        'spaceMember.id',
        'spaceMember.user_id',
        'spaceMember.space_id',
        'spaceMember.role',
        'user.nick_name',
      ])
      .where('spaceMember.space_id = :spaceId', { spaceId })
      .getMany();

    if (!members) {
      throw new NotFoundException('해당 스페이스에 멤버가 존재하지 않습니다.');
    }

    return members;
  }

  // async deleteMemberInSpace(deleteMemberInSpaceDto: DeleteMemberInSpaceDto) {
  //   let exUser = await this.findUserById(deleteMemberInSpaceDto.userId);
  //   if (!exUser) {
  //     throw new BadRequestException('방에 참여하고 있지 않은 유저입니다.');
  //   }
  //   try {
  //     await this.spaceMemberRepository.delete(exUser);
  //     return {
  //       code: 200,
  //       message: '해당 방에서 유저를 추방하는데 성공했습니다.',
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException('서버 오류 발생');
  //   }
  // }

  async deleteMemberInSpace(dto: DeleteMemberInSpaceDto, creatorId: number) {
    // 스페이스 멤버 존재 여부 확인
    const member = await this.spaceMemberRepository.findOne({
      where: {
        user_id: dto.userId,
        space_id: dto.spaceId,
      },
    });

    if (!member) {
      throw new NotFoundException(
        '해당 스페이스에 이 사용자는 존재하지 않습니다.',
      );
    }

    // 스페이스 개설자 확인
    const spaceCreator = await this.spaceRepository.findOne({
      where: { id: dto.spaceId, user_id: creatorId },
    });

    if (!spaceCreator) {
      throw new BadRequestException(
        '스페이스 개설자만이 사용자를 추방할 수 있습니다.',
      );
    }

    // 자기 자신을 추방하는지 확인
    if (dto.userId === creatorId) {
      throw new BadRequestException('본인을 추방할 수 없습니다.');
    }

    // 스페이스 멤버 추방
    try {
      await this.spaceMemberRepository.delete({
        user_id: dto.userId,
        space_id: dto.spaceId,
      });
      return {
        code: 200,
        message: '해당 방에서 유저를 추방하는데 성공했습니다.',
      };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  createSpaceMember(role: SpaceMemberRole) {
    const spaceMember = this.spaceMemberRepository.create({ role });
    return spaceMember;
  }

  // 학습 공간 저장은 현 서비스에서 하는게 맞다고 판단해 현 서비스에서 저장합니다.
  async saveSpaceMember(spaceMember: SpaceMember) {
    // 검증 해야할 것 이미 있는 멤버인가? 멤버가 실제로 존재하는가?
    try {
      await this.spaceMemberRepository.save(spaceMember);
    } catch (error) {
      throw new ConflictException('서버 에러 발생');
    }
  }
  // 추방기능도 만들어야 하나?
  // Private 영역
  async findUserById(userId) {
    try {
      const exUser = this.spaceMemberRepository.findOneBy({ user_id: userId });
      return exUser;
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async changeMemberRole(
    changeMemberRoleDto: ChangeMemberRoleDto,
    requestUserId: number,
  ) {
    // 권한 변경을 요청한 사용자가 스페이스의 관리자인지 확인

    const requester = await this.spaceMemberRepository.findOne({
      where: {
        user_id: requestUserId,
        space_id: changeMemberRoleDto.spaceId,
      },
    });

    if (requester.role !== SpaceMemberRole.Admin) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    // 변경 대상 멤버 찾기
    const targetMember = await this.spaceMemberRepository.findOne({
      where: {
        user_id: changeMemberRoleDto.targetUserId,
        space_id: changeMemberRoleDto.spaceId,
      },
    });

    if (!targetMember) {
      throw new NotFoundException('대상 멤버가 스페이스에 존재하지 않습니다.');
    }

    // 멤버의 역할 변경
    targetMember.role = changeMemberRoleDto.newRole;
    await this.spaceMemberRepository.save(targetMember);

    return { code: 200, message: '멤버의 역할이 변경되었습니다.' };
  }
}
