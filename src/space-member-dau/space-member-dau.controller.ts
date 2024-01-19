import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SpaceMemberDauService } from './space-member-dau.service';

@Controller('space-member-dau')
export class SpaceMemberDauController {
  constructor(private spaceMemberDauService: SpaceMemberDauService) {}
  //유저의 모든 날짜 접속 시간 가져오는 함수 리밋은 나중에 걸자

  @Post('/setEnterTime/:memberId')
  async setEnterTime(@Param('memberId', ParseIntPipe) memberId: number) {
    await this.spaceMemberDauService.setEnterTime(memberId);
  }

  @Post('/setLeaveTime/:memberId')
  @UsePipes(ValidationPipe)
  async setLeaveTime(@Param('memberId', ParseIntPipe) memberId: number, @Body('time') time: Date) {
    await this.spaceMemberDauService.setLeaveTime(memberId, time);
  }
}
