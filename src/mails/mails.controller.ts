import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { MailsService } from './mails.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  // 메일 생성
  // 강의 생성 시 자동으로 메일 생성.
  @Post()
  async create(spaceId: number, title: string) {
    return await this.mailsService.create(spaceId, title);
  }

  // 메일 전체 조회
  @Get()
  async findAll(@Req() req) {
    const data = await this.mailsService.findAll(req.user.id);
    return { status: HttpStatus.OK, message: '메일 전체 조회 성공', data };
  }

  // 메일 상세 조회
  @Get(':mailId')
  async findOne(@Param('mailId') mailId: string, @Req() req) {
    const data = await this.mailsService.findOne(+mailId, req.user.id);
    return { status: HttpStatus.OK, message: '메일 상세 조회 성공', data };
  }
}
