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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RedisService } from '../redis/redis.service';

import { AuthService } from './auth.service';
import { SendVerificationCodeDto } from '../auth/dto/send-verification-code.dto';
import { VerifyEmailDto } from '../auth/dto/verify-email.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private redisService: RedisService,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
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

    return { access_token: newAccessToken };
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
    await this.redisService.removeRefreshToken(req.user.email);
    return { message: '로그아웃 성공' };
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // 리다이렉트 페이지 작성
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const user = req.user;
    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    await this.redisService.setRefreshToken(user.email, refreshToken);
    return { aaccess_token: accessToken };
  }
}
