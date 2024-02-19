// src/payment/payment.controller.ts
import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express'; // Response 타입을 express에서 임포트
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  async createPayment(@Req() req, @Body() createPaymentDto: CreatePaymentDto) {
    const userId = req.user.id;
    return this.paymentService.createPayment(userId, createPaymentDto);
  }

  @Get('/user-payment')
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  async getPaymentByUser(@Req() req) {
    const userId = req.user.id;
    return this.paymentService.getPaymentByUserId(userId);
  }

  @Get('/successpage')
  successPage(
    @Query('classId') classId: string,
    @Query('spaceName') spaceName: string,
    @Query('spaceContent') spaceContent: string,
    @Query('spacePassword') spacePassword: string,
    @Query('email') email: string,
    @Res() res: Response,
  ): void {
    const filePath = path.join(__dirname, '../../test_pay_client/success.html');
    const clientUrl = this.configService.get<string>('CLIENT');
    const serverUrl = this.configService.get<string>(
      'TOSS_NEST_SERVER_PAYMENT',
    );
    const socketUrl = this.configService.get<string>('SOCKET');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        // 에러 처리
        return res.status(500).send('Error loading the page');
      }
      console.log('인풋 들어왔니?', spaceContent);
      console.log('인풋 들어왔니?', spacePassword);
      // HTML 내에서 환경변수 값을 삽입
      const modifiedHtml = data.replace(
        '/* ENV_VARIABLES */',
        `var ENV_VARS = {
        classId: "${classId}",
        spaceName: "${spaceName}",
        spaceContent: "${spaceContent}",
        spacePassword: "${spacePassword}",
        email: "${email}",
        clientUrl: "${clientUrl}",
        serverUrl: "${serverUrl}",
        socketUrl: "${socketUrl}",
      };`,
      );

      res.send(modifiedHtml);
    });
  }

  @Post('/create-billing-key')
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  async createBillingKey(
    @Req() req,
    @Body()
    body: {
      authKey: string;
      customerKey: string;
      classId: string;
      spaceName: string;
      spaceContent: string;
      spacePassword: string;
      email: string;
    },
  ) {
    const {
      authKey,
      customerKey,
      classId,
      spaceName,
      spaceContent,
      spacePassword,
      email,
    } = body;
    console.log('controller 바디값 ====>', body);
    const billingKey = await this.paymentService.createBillingKey(
      authKey,
      customerKey,
      classId,
      spaceName,
      spaceContent,
      spacePassword,
      email,
    );
    return { billingKey };
  }
}
