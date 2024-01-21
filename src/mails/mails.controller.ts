import {
  Controller,
  Get,
  Post,
  // Body, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
  // Patch, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
  Param,
  // Delete, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
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
