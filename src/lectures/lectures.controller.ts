import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  // 강의만들기
  // 강의삭제하기
  // 강의영상 추가하기(일단 구조는 생각안할거라 강의 영상에서 하자)
  // 강의 제목 수정하기(필수 아님)
  // 특정 스페이스의 강의 모두 조회하기

  // 테스트는 다 함.
  // 아무리 생각해봐도 일단 각 ERD별 모듈을 만드는게 맞는거 같다는 생각이 들기 시작한다.
  // 문제는 서비스별 분리를 나중에 해야한다는 건데 이게 결국 프로젝트가 만들어지면서 해야하는 과정이라
  // 일단 지금은 가능한 필수만 구현하고 전체를 보고 다시 연결해야 겠다.
  // TODO 내가 한 모든 모듈들 가드 적용되는지 확인하기

  @Get('/:spaceId')
  async findAllLectureBySpaceId(
    @Param('spaceId', ParseIntPipe) spaceId: number,
  ) {
    return await this.lecturesService.findAllLectureBySpaceId(spaceId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createLecture(@Body() createLectureDto: CreateLectureDto) {
    return await this.lecturesService.createLecture(createLectureDto);
  }

  @Delete('/:lectureId')
  async deleteLectureById(@Param('lecutreId', ParseIntPipe) lectureId: number) {
    return await this.lecturesService.deleteLectureById(lectureId);
  }
}
