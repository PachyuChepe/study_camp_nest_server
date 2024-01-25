// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Req,
  UnauthorizedException,
  ConflictException,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RedisService } from '../redis/redis.service';

import { AuthService } from './auth.service';
import { SendVerificationCodeDto } from '../auth/dto/send-verification-code.dto';
import { VerifyEmailDto } from '../auth/dto/verify-email.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { SpacesService } from 'src/spaces/spaces.service';
import { UsersService } from '../users/users.service';
import { PaymentService } from 'src/payment/payment.service';
import { EmailDto } from './dto/email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private redisService: RedisService,
    private spacesService: SpacesService,
    private userService: UsersService,
    private paymentService: PaymentService,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/get-token')
  async getTokenByEmail(@Body() emailDto: EmailDto) {
    const user = await this.userService.findOne(emailDto.email);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    const accessToken = await this.authService.generateAccessToken(user);
    return { access_token: accessToken };
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('jwt'))
  async refreshAccessToken(@Req() req) {
    const user = req.user;

    const refreshToken = await this.redisService.getRefreshToken(user.email);
    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
    }

    const newAccessToken = this.authService.generateAccessToken(user);

    // 사용자가 멤버인 스페이스 목록 가져오기
    const memberSpaces = await this.spacesService.findSpacesByMember(user.id);
    const memberSearch = await this.userService.findOne(user.email);

    return {
      access_token: newAccessToken,
      member_spaces: memberSpaces, // 추가
      member_search: memberSearch, // 추가
    };
  }

  @Post('/send-verification')
  async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
  ) {
    await this.authService.sendVerificationCode(sendVerificationCodeDto.email);
    return { message: '인증번호를 전송했습니다.' };
  }

  @Post('/verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const isValid = await this.authService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.code,
    );
    if (isValid) {
      return { message: '이메일 인증 성공' };
    } else {
      throw new ConflictException('인증번호가 일치하지 않습니다.');
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req) {
    await this.redisService.removeAccessToken(req.user.email);
    await this.redisService.removeRefreshToken(req.user.email);
    return { message: '로그아웃 성공' };
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // 추후 리다이렉트 페이지 작성
  }

  // @Get('/google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req) {
  //   const user = req.user;
  //   const accessToken = this.authService.generateAccessToken(user);
  //   const refreshToken = this.authService.generateRefreshToken(user);

  //   await this.redisService.setRefreshToken(user.email, refreshToken);
  //   return { aaccess_token: accessToken };
  // }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    const accessToken = await this.authService.generateAccessToken(user);
    await this.authService.generateRefreshToken(user);
    const memberSpaces = await this.spacesService.findSpacesByMember(user.id);
    const memberSearch = await this.userService.findOne(user.email);
    const memberCustomerKey = await this.paymentService.getPaymentByUserId(
      user.id,
    );

    // 사용자 식별자를 키로 사용하여 인증 데이터 저장
    await this.redisService.saveAuthData(user.id, {
      access_token: accessToken,
      member_spaces: memberSpaces,
      member_search: memberSearch,
      member_customer_key: memberCustomerKey,
    });

    // 클라이언트에게 인증 완료 신호 전송 (예: JavaScript 함수 호출)
    const script = `<script>
                      window.opener.postMessage({
                        type: 'auth-complete',
                        data: { userId: '${user.id}' }
                      }, '*');
                      window.close();
                    </script>`;
    res.send(script);
  }

  @Get('/stream/:userId')
  async stream(@Param('userId') userId: string, @Res() res) {
    const data = await this.redisService.getAuthData(userId);

    if (!data) {
      return res.status(404).json({ message: 'No authentication data found' });
    }

    // Replace `"Connection"` with `Connection`는 프리티어 에러라 무시해도 됨
    res.status(200).set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    res.write(`data: ${JSON.stringify(data)}\n\n`);

    setTimeout(async () => {
      await this.redisService.removeAuthData(userId);
      res.end();
    }, 5000);
  }
}
