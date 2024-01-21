import {
  Body,
  Controller,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LectureProgressService } from './lecture-progress.service';
import { CreateLectureProgressDto } from './dto/create-lecture-progress.dto';
import { UpdateLectureProgressDto } from './dto/update-lecture-progress.dto';

@Controller('lecture-progress')
export class LectureProgressController {
  constructor(private lectureProgressService: LectureProgressService) {}

  // 강의진도 생성하기
  // 강의진도 업데이트하기
  // 강의진도 삭제가 필요한가? 아닌거 같다.
  // 진도체크는 로직이 강화되어야 한다. 많이 생각해보자
  // undefined체크는 하면 안된다 이건 힘들고 1이랑 2로 선별해야할 것 같다. 1이 안들은 상태 2가 들은 상태
  // 따로 만들어둬야 하나? 그건 나중에 생각하자. 지금은 최소 구현 실행 테스트만 해보자.

  @Post()
  @UsePipes(ValidationPipe)
  async createLectureProgressInLecture(
    @Body() createLectureProgressDto: CreateLectureProgressDto,
  ) {
    return await this.lectureProgressService.createLectureProgressInLecture(
      createLectureProgressDto,
    );
  }

  @Patch()
  @UsePipes(ValidationPipe)
  async updateLectureProgressById(
    @Body() updateLectureProgressDto: UpdateLectureProgressDto,
  ) {
    return await this.lectureProgressService.updateLectureProgressById(
      updateLectureProgressDto,
    );
  }
}
