import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express'; // Response 타입을 express에서 임포트
import { PayService } from './pay.service';
import { CreatePayDto } from './dto/create-pay.dto';
import path from 'path';
// import { AuthGuard } from '@nestjs/passport';
// import { JwtAuthGuard } from '../guard/jwt-auth.guard';

// @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Get('/successpage')
  successPage(@Res() res: Response): void {
    res.sendFile(path.join(__dirname, '../../../test_pay_client/success.html'));
  }

  @Post('/success')
  async successPay(@Body() CreatePayDto: CreatePayDto) {
    return await this.payService.successPay(CreatePayDto);
  }
}
// 클라이언트에서 엑세스 토큰을 넘겨주면 인증가드 활성화 필요
