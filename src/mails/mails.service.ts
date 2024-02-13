import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity';
import { Repository } from 'typeorm';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { HttpStatusCode } from 'axios';
import { SseService } from 'src/sse/sse.service';

@Injectable()
export class MailsService {
  constructor(
    @InjectRepository(Mail)
    private mailsRepository: Repository<Mail>,
    @InjectRepository(SpaceMember)
    private readonly spaceMemberRepository: Repository<SpaceMember>,
    private readonly groupMembersService: GroupMembersService,
    private sseService: SseService,
  ) {}
  async create(spaceId: number, title: string) {
    // 강의가 생성됬을 때
    // 해당 강의에 속한 space_id에 해당하는 spaceMember 가지고오기.
    const isSpaceMembers = await this.spaceMemberRepository.find({
      where: { space_id: spaceId },
      order: { user_id: 'ASC' },
      select: ['id', 'user_id', 'role'],
    });

    // space_member에 속하는 사람에게 메일 생성.
    isSpaceMembers.forEach(async (member) => {
      const result = await this.mailsRepository.save({
        member_id: member.id,
        title: `${title} 강의 지급!`,
        content: `${title} 강의가 지급되었습니다. 지금 확인해보세요!`,
      });
      console.log(result);
      this.sseService.notifyClients({
        member_id: member.id,
        title: `${title} 강의 지급`,
        content: `${title} 강의가 지급되었습니다. 지금 확인해보세요!`,
      });
    });
  }

  // 그룹 메세지 생성
  async createGroupMessage(groupId: number, message: string) {
    const members = await this.groupMembersService.getMembersByGroupId(groupId);

    if (members.length === 0) {
      throw new NotFoundException('해당 그룹에 멤버가 존재하지 않습니다.');
    }

    members.forEach(async (data) => {
      await this.mailsRepository.save({
        member_id: data.member_id,
        title: `그룹 메세지`,
        content: `${message}`,
      });

      this.sseService.notifyClients({
        member_id: data.member_id,
        title: `그룹 메세지`,
        content: `${message}`,
      });
    });

    return { status: HttpStatusCode.Created };
  }

  // 메일 전체 조회
  async findAll(userId: number) {
    // 스페이스 맴버에 속하는지 검증
    await this.isSpaceMember(userId);

    const isMember = await this.spaceMemberRepository.findOne({
      where: { user_id: userId },
      select: ['id'],
    });

    return await this.mailsRepository.find({
      where: { member_id: isMember.id },
    });
  }

  // 메일 상세 조회
  async findOne(mailId: number, userId: number) {
    // 스페이스 맴버에 속하는지 검증
    await this.isSpaceMember(userId);

    return await this.mailsRepository.findOne({ where: { id: mailId } });
  }

  // 사용자 검증
  async isSpaceMember(userId: number) {
    const isSpaceMember = await this.spaceMemberRepository.findOne({
      where: { user_id: userId },
    });
    if (!isSpaceMember) {
      throw new NotAcceptableException('권한이 없습니다.');
    }
  }
}
