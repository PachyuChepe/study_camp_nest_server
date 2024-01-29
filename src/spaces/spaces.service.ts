import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// import { CreateSpaceDto } from './dto/create-space.dto';
// import { UpdateSpaceDto } from './dto/update-space.dto'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from './entities/space.entity';
// import { SpaceMembersModule } from 'src/space-members/space-members.module'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
import { SpaceMembersService } from 'src/space-members/space-members.service';
import { SpaceMemberRole } from 'src/space-members/types/space-member-role.type';
import { SpaceMember } from '../space-members/entities/space-member.entity';
import { SpaceClass } from './entities/space-class.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space) private spacesRepository: Repository<Space>,
    private spaceMemberService: SpaceMembersService,

    @InjectRepository(SpaceMember)
    private spaceMemberRepository: Repository<SpaceMember>,

    @InjectRepository(SpaceClass) // SpaceClass 리포지토리 추가
    private spaceClassRepository: Repository<SpaceClass>,

    private redisService: RedisService,
  ) {}

  // 구글 로그인 이후 socket연결하면 검증된 유저다.
  // login local(test)+ google(main)

  // Public영역
  // 추상화된 어떤 큰게 있는데 그게 유저랑 스페이스 관리한다.
  // 서비스는 막 만들자. S규칙 지키면서
  // 컨트롤러는 결국 URL요청 받기 위해 쓰는 것.
  // 보안 결제한 유저냐 진짜 있는 유저냐 강제로 개발자 도구 열어서 보내는건 막아야지
  // 코드를 더 짜봐야 안다. 지금 이 시점에서 확실하게 말해줄 수 없다.
  // 일단 짜고 나서 생각해라.
  async createSpace(
    name: string,
    classId: number,
    content: string,
    password: string,
    userId: number,
  ) {
    try {
      const exSpace: Space = await this.findSpaceByName(name);
      this.IsSpaceExisting(exSpace);
      // 이 부분도 고민해보자 이렇게 길어질 필요가 없는데
      // 유저가 실제로 존재하는지 클래스가 실제로 존재하는지를 여기서 검증해야 하나?
      let newSpace = this.spacesRepository.create({
        name: name,
        class_id: classId,
        content: content,
        password: password,
        user_id: userId,
      });
      // 오류처리 어떻게 하냐 서버 멈추는데
      // 왜 유저 1 클래스 1 유저 2 클래스 2는 되는데 유저 1 클래스 2 유저 2 클래스 1은 안되냐
      // 이건 고민 많이 해봐야 겠는데
      // 일단 있는지 부터 좀 찾아볼래?
      newSpace = await this.spacesRepository.save(newSpace);
      const exUser = this.spaceMemberService.createSpaceMember(
        SpaceMemberRole.Admin,
      );
      // 여기도 생각 많이 해보자. 코드 리팩토링 필요하다.
      exUser.user_id = newSpace.user_id;
      exUser.space_id = newSpace.id;
      await this.spaceMemberService.saveSpaceMember(exUser);
      const spaces = await this.findSpacesByMember(userId);
      return { code: 201, message: 'You succesfully make a space', spaces };
    } catch (error) {
      // 고쳐아 함.
      if (error.errno == 1452) {
        throw new ConflictException('서버 에러 발생');
      }
      throw error;
    }
  }
  // 삭제하고자 하는 유저가 방을 만든 장본인인지 확인해야 한다.
  // 어떻게 확인할 것인가? 가드? 데코레이터? 이건 말을 해봐야 알 수 있다.
  async deleteSpace(name: string, userId: number) {
    try {
      // TODO: 방을 만든 장본인인지 확인하는 로직이 필요하다.
      // 누구한테 물어봐야 하나? 권한은 가드고 정보는 데코레이터 jwt쓰면 정보 줄거고
      const exSpace = await this.spacesRepository.findOne({
        where: { name, user_id: userId },
      });
      if (!exSpace) {
        throw new NotFoundException(
          '해당하는 스페이스가 없거나 접근 권한이 없습니다.',
        );
      }
      await this.spacesRepository.delete({ name, user_id: userId });
      return { code: 200, message: 'You successfully delete the space' };
    } catch (error) {
      throw error;
    }
  }

  async findAllSpaces() {
    try {
      const spaces = await this.spaceClassRepository.find({
        relations: ['space'],
      });
      return spaces;
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  // 이건 단일로 써도 되는건가?
  // async findSpacesByUser(user: any) {
  //   let results = await this.spacesRepository.findBy({ user_id: user.id });
  //   return results;
  // }

  // 사용자가 멤버로 있는 스페이스 조회
  async findSpacesByMember(userId: number) {
    try {
      const memberSpaces = await this.spaceMemberRepository.find({
        where: { user_id: userId },
        relations: ['space', 'space.space_class'],
      });

      // 각 스페이스와 해당 스페이스에서의 사용자 역할을 포함한 객체 반환
      return memberSpaces.map((member) => ({
        space: member.space,
        role: member.role,
        capacity: member.space.space_class.capacity,
      }));
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  // Private영역
  // #DB func
  private async findSpaceByName(name: string): Promise<Space> {
    try {
      const result = await this.spacesRepository.findOneBy({ name: name });
      return result;
    } catch (error) {
      throw new ConflictException('서버 에러');
    }
  }

  // #checker
  private IsSpaceExisting(space: Space) {
    if (space) {
      throw new BadRequestException('해당하는 방이 이미 존재합니다.');
    }
  }

  async findSpaceClassById(classId: number): Promise<SpaceClass | null> {
    try {
      const spaceClass = await this.spaceClassRepository.findOne({
        where: { id: classId },
      });
      return spaceClass || null;
    } catch (error) {
      throw new NotFoundException('클래스를 찾을 수 없습니다.');
    }
  }

  async findAllSpaceClasses(): Promise<SpaceClass[]> {
    try {
      return await this.spaceClassRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async isUserSpace(userId: number, spaceId: number) {
    try {
      console.log('spaceId =>', spaceId);
      const space = await this.spacesRepository.findOne({
        where: { id: spaceId },
      });

      const isUserInSpace = await this.spaceMemberRepository.findOne({
        where: { space_id: spaceId, user_id: userId },
      });
      console.log('서비스 ===>', space.password);

      return { space: space.password, isUserInSpace: isUserInSpace || null };
    } catch (error) {
      throw new NotFoundException('스페이스를 찾을 수 없습니다.');
    }
  }

  // 초대 코드 생성
  async createInvitngCode(spaceId: number, userId: number) {
    const isSpaceMember = await this.spaceMemberRepository.findOne({
      where: { space_id: spaceId, user_id: userId },
    });

    console.log('isSpaceMember =====>', isSpaceMember.role);
    if (isSpaceMember.role !== 0) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const numbers = '0123456789';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = 0; i < 3; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    for (let i = 3; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    result = result
      .split('')
      .sort(() => {
        return 0.5 - Math.random();
      })
      .join('');

    await this.redisService.saveInvitingCode(spaceId, result);
    return result;
  }

  // 초대 코드 검증
  async checkInvitingCode(userId: number, code: string) {
    const result = await this.redisService.getInvitingCode(code);

    // 해당 스페이스의 멤버인지 확인
    const checkUserInSpace = await this.spacesRepository.findOne({
      where: { id: +result, user_id: userId },
    });
    if (checkUserInSpace) {
      throw new BadRequestException('이미 해당 스페이스의 멤버 입니다.');
    }

    // 스페이스 멤버 등록
    const signUpSpaceMember = await this.spaceMemberRepository.save({
      user_id: userId,
      space_id: +result,
    });

    return signUpSpaceMember;
  }
}
