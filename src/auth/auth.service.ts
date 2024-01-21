// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { EmailService } from './nodemailer/auth.nodemailer';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { SpacesService } from 'src/spaces/spaces.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private emailService: EmailService,
    private spacesService: SpacesService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException(
        '존재하지 않는 회원이거나 비밀번호가 틀립니다.',
      );
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.redisService.setRefreshToken(user.email, refreshToken);

    const memberSpaces = await this.spacesService.findSpacesByMember(user.id);
    const memberSearch = await this.userService.findOne(user.email);

    return {
      message: '로그인 완료',
      access_token: accessToken,
      member_spaces: memberSpaces, // 추가
      memberSearch: memberSearch, //추가
    };
  }
  async sendVerificationCode(email: string): Promise<void> {
    // const code = Math.random().toString(36).substring(2, 8);
    const code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    await this.redisService.setVerificationCode(email, code.toString());
    await this.emailService.sendVerificationEmail(email, code.toString());
  }

  async verifyEmail(email: string, code: string): Promise<boolean> {
    const storedCode = await this.redisService.getVerificationCode(email);
    return storedCode === code;
  }

  async validateOAuthLogin(userProfile: any): Promise<User> {
    let user = await this.userService.findByEmail(userProfile.email);
    if (!user) {
      const newUser = new CreateUserDto();
      newUser.email = userProfile.email;
      newUser.nick_name = `${userProfile.lastName}${userProfile.firstName}`;
      // ... 추가적인 사용자 정보 설정 ...
      user = await this.userService.create(newUser);
    }
    return user;
  }

  generateAccessToken(user: any) {
    const payload = { email: user.email, sub: user.id };

    return this.jwtService.sign(payload);
  }

  generateRefreshToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
