import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LectureItemsService } from './lecture-items.service';
import { CreateLectureItemsDto } from './dto/create-lecture-items.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('lecture-items')
export class LectureItemsController {
  constructor(private lectureItemsService: LectureItemsService){}

  //강의에 강의영상추가하기
  //강의에 강의영상삭제하기
  //특정 강의의 모든 강의영상 조화하기
  //강의영상수정하기는 필수는 아닌거 같음 삭제 추가가 수정이잖아.
  
  @Post()
  @UsePipes(ValidationPipe)
  async createLectureItemInLecture(@Body() createLectureItemsDto:CreateLectureItemsDto){
    return await this.lectureItemsService.createLectureItemInLecture(createLectureItemsDto)
  }

  @Delete('/:lectureItemId')
  async deleteLectureItemByID(@Param('lectureItemId') lectureItemId: number) {
    return await this.lectureItemsService.deleteLectureItemByID(lectureItemId);
  }

  @Get()
  async findAllLectureItemsByLectureID(lectureId) {
    return await this.lectureItemsService.findAllLectureItemsByLectureID(lectureId);
  }
}
