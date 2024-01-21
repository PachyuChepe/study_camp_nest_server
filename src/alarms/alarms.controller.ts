import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AlarmsService } from './alarms.service';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('/space')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  // 알람 생성
  @Post('/:spaceId/alarm')
  async create(
    @Body() createAlarmDto: CreateAlarmDto,
    @Param('spaceId') spaceId: string,
  ) {
    let data = await this.alarmsService.create(createAlarmDto, +spaceId);

    return {
      statusCode: HttpStatus.CREATED,
      message: `알람 생성 성공`,
      data: data,
    };
  }

  // 알람 전체 조회
  @Get('/:spaceId/alarm')
  async findAll(@Param('spaceId') spaceId: string) {
    return await this.alarmsService.findAll(+spaceId);
  }

  // 알람 상세 조회
  @Get('/:spaceId/alarm/:alarmId')
  async findOne(
    @Param('spaceId') spaceId: string,
    @Param('alarmId') alarmId: string,
  ) {
    return await this.alarmsService.findOne(+spaceId, +alarmId);
  }

  // 알람 수정
  @Patch('/:spaceId/alarm/:alarmId')
  async update(
    @Param('spaceId') spaceId: string,
    @Param('alarmId') alarmId: string,
    @Body() createAlarmDto: CreateAlarmDto,
  ) {
    let update = await this.alarmsService.update(
      +spaceId,
      +alarmId,
      createAlarmDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: `알람 수정 성공`,
      data: update,
    };
  }

  // 알람 삭제
  @Delete('/:spaceId/alarm/:alarmId')
  async remove(
    @Param('spaceId') spaceId: string,
    @Param('alarmId') alarmId: string,
  ) {
    await this.alarmsService.remove(+spaceId, +alarmId);

    return {
      statusCode: HttpStatus.OK,
      message: `${alarmId}번 알람 삭제 성공.`,
    };
  }
}
