import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  //현재 ERD상에서 어떻게 한명의 유저의 진도를 체크하냐가 문제이다
  //현재 ERD상에서는 강의 안에 여러 강의영상이 들어 있다.
  //그리고 강의가 강의진도를 가지는 형태가 된다.
  //그리고 멤버들도 강의진도를 가진다.
  //강의진도를 확인하기 위해서는 강의영상이 완료했는지 안했는지의 유무를 알아야 한다.
  ///그러나 ERD상에서는 멤버가 어떤 강의를 완료했는지 알 수 있는 방법이 없다.
  //나라면 어떻게 할 것인가?
  //일단 멤버가 여러강의를 가질 수 있어야 한다.
  // 그리고 그 강의 안에 강의 영상들이 있어야 한다.
  // 강의 영상은 완료했는지 안했는지를 나타내는 무언인가가 있어야 한다.
  //유저가 가지는 강의의 전체 강의 영상에서 완료한 강의영상을 통해서 강의 진도를 만든다.
  //강의에 유저 아이디가 있고 강의영상은 강의가 가지고 있기 때문에
  //강의진도에는 강의만 연결해도 될거라 생각한다.
  @Post()
  createLecture(@Body() createLectureDto: CreateLectureDto) {
    return this.lecturesService.createLecture(createLectureDto);
  }

  @Get()
  findAll() {
    return this.lecturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLectureDto: UpdateLectureDto) {
    return this.lecturesService.update(+id, updateLectureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lecturesService.remove(+id);
  }
}
