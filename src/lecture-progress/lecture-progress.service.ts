import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LectureProgress } from './dto/entities/lecture-progress.entity';
import { Repository } from 'typeorm';
import { CreateLectureProgressDto } from './dto/create-lecture-progress.dto';
import { UpdateLectureProgressDto } from './dto/update-lecture-progress.dto';

@Injectable()
export class LectureProgressService {
  constructor(
    @InjectRepository(LectureProgress)
    private lectureProgressRepository: Repository<LectureProgress>,
  ) {}
  // public영역
  async createLectureProgressInLecture(
    createLectureProgressDto: CreateLectureProgressDto,
  ) {
    const checker: string = JSON.stringify(
      this.createChecker(createLectureProgressDto.lectureCount),
    );
    const lectureProgress = this.lectureProgressRepository.create({
      member_id: createLectureProgressDto.memberId,
      lecture_id: createLectureProgressDto.lectureId,
      progress: 0,
      checker,
    });
    try {
      await this.lectureProgressRepository.save(lectureProgress);
      return { code: 201, message: '성공적으로 강의진도를 등록하셨습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  async updateLectureProgressById(
    updateLectureProgressDto: UpdateLectureProgressDto,
  ) {
    const lectureProgress: LectureProgress =
      await this.findOneLectureProgressById(
        updateLectureProgressDto.lectureProgressId,
      );
    if (!lectureProgress) {
      throw new NotFoundException('해당하는 강의진도가 없습니다.');
    }
    const checker: number[] = JSON.parse(lectureProgress.checker);
    if (checker[updateLectureProgressDto.lectureItemOrder - 1] == undefined) {
      throw new BadRequestException(
        '해당 강의에는 해당 강의영상이 존재하지 않습니다.',
      );
    } else {
      checker[updateLectureProgressDto.lectureItemOrder - 1] = 2;
    }
    const percentageOfProgress = this.calculatePercentageOfProgress(checker);
    lectureProgress.progress = percentageOfProgress;
    lectureProgress.checker = JSON.stringify(checker);
    this.lectureProgressRepository.save(lectureProgress);
  }

  // private영역
  private createChecker(lectureCount: number): number[] {
    const checkerArray: number[] = [];
    for (let i = 0; i < lectureCount; i++) {
      checkerArray[i] = 1;
    }
    return checkerArray;
  }

  private async findOneLectureProgressById(
    lectureProgressId: number,
  ): Promise<LectureProgress> {
    try {
      return await this.lectureProgressRepository.findOneBy({
        id: lectureProgressId,
      });
    } catch (error) {
      throw new InternalServerErrorException('서버 오류 발생');
    }
  }

  private calculatePercentageOfProgress(checker: number[]): number {
    const total = checker.length;
    let lectureItemsCompleted = 0;
    for (let i = 0; i < checker.length; i++) {
      if (checker[i] == 2) {
        lectureItemsCompleted++;
      }
    }
    return lectureItemsCompleted / total;
  }
}
