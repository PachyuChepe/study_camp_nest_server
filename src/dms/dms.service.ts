import { Injectable } from '@nestjs/common';
import { CreateDmDto } from './dto/create-dm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dm } from './entities/dm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DmsService {
  constructor(
    @InjectRepository(Dm)
    private dmsRepository: Repository<Dm>,
  ) {}

  // DM 보내기
  async create(
    createDmDto: CreateDmDto,
    receiveUserId: number,
    sendUserId: number,
  ) {
    const createdMessage = await this.dmsRepository.save({
      receive_user: { id: receiveUserId },
      send_user: { id: sendUserId },
      content: createDmDto.content,
    });
    return createdMessage;
  }

  // DM 불러오기
  async findAll(userId: number) {
    // 24시간 지난 dm은 삭제
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const oldRecords = await this.dmsRepository
      .createQueryBuilder('dm')
      .where('dm.receive_user_id = :userId OR dm.send_user_id = :userId', {
        userId,
      })
      .andWhere('dm.created_at < :yesterday', { yesterday })
      .getMany();

    if (oldRecords.length > 0) {
      await this.dmsRepository.remove(oldRecords);
      console.log('오래된 데이터를 삭제했습니다.');
    }

    // 로그인 한 userId를 포함하는 보낸dm, 받은dm 모두 불러오기
    const dms = await this.dmsRepository
      .createQueryBuilder('dm')
      .select([
        'dm.id',
        'dm.content',
        'dm.created_at',
        'dm.receive_user_id',
        'dm.send_user_id',
      ])
      .where('dm.receive_user_id = :userId OR dm.send_user_id = :userId', {
        userId,
      })
      .getMany();

    return dms;
  }
}
