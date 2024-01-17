import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture } from './entities/lecture.entity';

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(Lecture) private lectureRepository: Repository<Lecture>,
  ) {}

  //public 영역
  async findAllLectureBySpaceId(spaceId: number) {
    try {
      return await this.lectureRepository.findBy({ space_id: spaceId });
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async createLecture(createLectureDto: CreateLectureDto) {
    try {
      let lecture = this.lectureRepository.create({
        space_id: createLectureDto.spaceId,
        title: createLectureDto.title,
        count: 0,
      });
      await this.lectureRepository.save(lecture);
      return { code: 200, message: '성공적으로 해당 강의를 등록하였습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async deleteLectureById(lectureId: number) {
    let lecture = await this.findLectureByID(lectureId);
    if (!lecture) {
      throw new NotFoundException('해당하는 강의가 존재하지 않습니다.');
    }
    try {
      await this.lectureRepository.delete(lecture);
      return { code: 200, message: '성공적으로 해당 강의를 삭제하였습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  //private 영역
  private async findLectureByID(lectureId: number) {
    try {
      return await this.lectureRepository.findOneBy({ id: lectureId });
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }
}
