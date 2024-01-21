// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RedisService } from 'src/redis/redis.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}
  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    return { message: '회원가입이 완료되었습니다.' };
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.email);
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return { message: '전체 회원 조회 성공', users };
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(req.user.id, updateUserDto);
    return { message: '회원 정보가 업데이트되었습니다.' };
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  async removeProfile(@Request() req) {
    await this.usersService.remove(req.user.id);
    await this.redisService.removeRefreshToken(req.user.email);
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
