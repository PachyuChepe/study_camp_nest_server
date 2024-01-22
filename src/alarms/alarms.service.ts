import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlarmDto } from './dto/create-alarm.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Alarm } from './entities/alarm.entity';
import { Repository } from 'typeorm';
import * as schedule from 'node-schedule';
import { Space } from 'src/spaces/entities/space.entity';

@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(Alarm)
    private alarmsRepository: Repository<Alarm>,
    @InjectRepository(Space)
    private readonly spaceRepository: Repository<Space>,
  ) {}

  // 알람 생성
  async create(createAlarmDto: CreateAlarmDto, spaceId: number) {
    const existAlarm = await this.alarmsRepository.findOne({
      where: {
        time: createAlarmDto.time,
        type: createAlarmDto.type,
        space_id: spaceId,
      },
    });

    if (existAlarm) {
      throw new BadRequestException('이미 존재하는 알람입니다.');
    }

    const newAlarm = this.alarmsRepository.create({
      ...createAlarmDto,
      space_id: spaceId,
    });

    await this.sendAlarmToUsers(createAlarmDto.time, spaceId);
    return await this.alarmsRepository.save(newAlarm);
  }

  // 알람 전체 조회
  async findAll(spaceId: number) {
    return await this.alarmsRepository.find({ where: { space_id: spaceId } });
  }

  // 알람 상세 조회
  async findOne(spaceId: number, alarmId: number) {
    return await this.alarmsRepository.findOne({
      where: { id: alarmId, space_id: spaceId },
    });
  }

  // 알람 수정
  async update(
    spaceId: number,
    alarmId: number,
    createAlarmDto: CreateAlarmDto,
  ) {
    const existAlarm = await this.alarmsRepository.findOne({
      where: {
        space_id: spaceId,
        id: alarmId,
      },
    });

    if (!existAlarm) {
      throw new NotFoundException('해당 알람이 존재하지 않습니다.');
    }

    return await this.alarmsRepository.update(alarmId, createAlarmDto);
  }

  // 알람 삭제
  async remove(spaceId: number, alarmId: number) {
    const existAlarm = await this.alarmsRepository.findOne({
      where: {
        space_id: spaceId,
        id: alarmId,
      },
    });

    if (!existAlarm) {
      throw new NotFoundException('해당 알람이 존재하지 않습니다.');
    }

    return await this.alarmsRepository.delete(alarmId);
  }
  // 특정 시간마다 알림 전송
  async sendAlarmToUsers(time: any, spaceId: number) {
    const date = new Date(time);
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString();
    const seconds = date.getSeconds().toString();
    console.log(`${hours}시 ${minutes}분 ${seconds}초`);
    schedule.scheduleJob(`${seconds} ${minutes} ${hours} * * *`, async () => {
      const spaceMembers = await this.spaceRepository.find({
        where: { id: spaceId },
        select: ['user_id'],
      });

      console.log('space에 속해있는 users ===>', spaceMembers);
    });
  }
}
