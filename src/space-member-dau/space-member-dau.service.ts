import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceMemberDau } from '../space-members/entities/space-member-dau.entity';
import { Between, Repository, getRepository } from 'typeorm';

@Injectable()
export class SpaceMemberDauService {
  constructor(
    @InjectRepository(SpaceMemberDau)
    private spaceMemberDauRepository: Repository<SpaceMemberDau>,
  ) {}

  //UTC문제
  //Public영역
  async setEnterTime(memberId: number) {
    //오늘 생성된 것이 있나 확인해야함.
    let todaySpaceMemberDau = await this.findTodaySpaceMemberDau(memberId);
    await this.isNotExistingTodayEnterTime(todaySpaceMemberDau);
    let startTime = this.spaceMemberDauRepository.create({
      member_id: memberId,
      created_at: new Date(),
    });
    try {
      await this.spaceMemberDauRepository.save(startTime);
      return { code: 200, message: 'You successfully set Your startTime' };
    } catch (error) {
      throw new ConflictException('존재하지 않는 멤버입니다.');
    }
  }
  //이건 시간 형식 모르면 어떻게 할 수가 없다 나중에 물어보자.
  //입장 시간 받는다고 생각하자. disconnet하면 입장 시간 보내주고 내가 new Date하는걸로
  //string가 더 편할지도
  async setLeaveTime(memberId: number, time: Date) {
    let result = await this.findTodaySpaceMemberDau(memberId);
    if(result){
      throw new NotFoundException("오늘 입장하신 적이 없는 멤버입니다.")
    }
    
  }

  //Private 영역
  //DB func
  private async findTodaySpaceMemberDau(memberId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘의 시작 시간으로 설정

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // 내일의 시작 시간으로 설정

    try {
      const todaySpaceMemberDau = await this.spaceMemberDauRepository.findOne({
        where: {
          created_at: Between(today, tomorrow),
          member_id: memberId
        },
      });
      return todaySpaceMemberDau
    } catch (error) {
      throw new InternalServerErrorException('내부 서버 에러');
    }
  }

  private async addActiveTime(time: Date) {
  }

  //Checker
  private async isExistingTodayEnterTime(spaceMemberDau: SpaceMemberDau){
    if(!spaceMemberDau){
      throw new BadRequestException("오늘 입장한 적이 없는 유저입니다.")
    }
  };

  private async isNotExistingTodayEnterTime(spaceMemberDau: SpaceMemberDau){
    if(spaceMemberDau){
      throw new BadRequestException("오늘 입장한 적이 있는 유저입니다.")
    }
  }
}
