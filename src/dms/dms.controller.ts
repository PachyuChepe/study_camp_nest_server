import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { DmsService } from './dms.service';
import { CreateDmDto } from './dto/create-dm.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('dms')
export class DmsController {
  constructor(private readonly dmsService: DmsService) {}

  // DM 보내기
  @Post('/:receiveUserId')
  async create(
    @Body() createDmDto: CreateDmDto,
    @Param('receiveUserId') receiveUserId: string,
    @Req() req,
  ) {
    const data = await this.dmsService.create(
      createDmDto,
      +receiveUserId,
      req.user.id,
    );
    return { status: HttpStatus.CREATED, message: '전송 성공', data };
  }

  // DM 불러오기
  @Get()
  async findAll(@Req() req) {
    const data = await this.dmsService.findAll(req.user.id);
    return { status: HttpStatus.OK, message: '조회 성공', data };
  }
}
