import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LectureItem } from './entities/lecture-items.entity';
import { Repository } from 'typeorm';
import { CreateLectureItemsDto } from './dto/create-lecture-items.dto';

@Injectable()
export class LectureItemsService {
  constructor(
    @InjectRepository(LectureItem)
    private lectureItemRepository: Repository<LectureItem>,
  ) {}

  // Public영역
  async createLectureItemInLecture(
    createLectureItemsDto: CreateLectureItemsDto,
  ) {
    // TODO 제발 구조분해 할당좀 이용해라 정훈아 이게 C++이냐 진짜 너무한거 아니냐
    const lecture = this.lectureItemRepository.create({
      lecture_id: createLectureItemsDto.lectureId,
      title: createLectureItemsDto.title,
      url: createLectureItemsDto.url,
    });
    try {
      await this.lectureItemRepository.save(lecture);
      // TODP POST부분은 제발 다 201로 바꾸고
      return { code: 201, message: '강의영상을 성공적으로 등록하였습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async deleteLectureItemByID(lectureItemId: number) {
    const exLectureItem = await this.findLectureItemsByID(lectureItemId);
    if (!exLectureItem) {
      throw new NotFoundException('존재하지 않는 강의 영상입니다.');
    }
    try {
      await this.lectureItemRepository.delete(exLectureItem);
      return {
        code: 200,
        message: '성공적으로 해당 강의 영상을 삭제 했습니다.',
      };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async findAllLectureItemsByLectureID(lectureId: number) {
    try {
      return await this.lectureItemRepository.findBy({ lecture_id: lectureId });
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  // Private영역
  private async findLectureItemsByID(lectureItemId: number) {
    try {
      return await this.lectureItemRepository.findOneBy({ id: lectureItemId });
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }
}
