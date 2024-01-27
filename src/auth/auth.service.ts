// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { EmailService } from './nodemailer/auth.nodemailer';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { SpacesService } from 'src/spaces/spaces.service';
import { PaymentService } from 'src/payment/payment.service';
// import { SseService } from './../sse/sse.service'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private emailService: EmailService,
    private spacesService: SpacesService,
    private paymentService: PaymentService,
    // private sseService: SseService, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
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
    const accessToken = await this.generateAccessToken(user);
    await this.generateRefreshToken(user);

    const memberSpaces = await this.spacesService.findSpacesByMember(user.id);
    const memberSearch = await this.userService.findOne(user.email);
    const memberCustomerKey = await this.paymentService.getPaymentByUserId(
      user.id,
    );

    return {
      message: '로그인 완료',
      access_token: accessToken,
      member_spaces: memberSpaces, // 추가
      member_search: memberSearch, // 추가
      member_customer_key: memberCustomerKey,
    };
  }

  async sendVerificationCode(email: string): Promise<void> {
    // const code = Math.random().toString(36).substring(2, 8);
    const existingUser = await this.userService.findByEmailGoogle(email);
    if (existingUser) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    const code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    await this.redisService.setVerificationCode(email, code.toString());
    await this.emailService.sendVerificationEmail(email, code.toString());
  }

  async verifyEmail(email: string, code: string): Promise<boolean> {
    const storedCode = await this.redisService.getVerificationCode(email);
    return storedCode === code;
  }

  async validateOAuthLogin(userProfile: any): Promise<User> {
    let user = await this.userService.findByEmailGoogle(userProfile.email);
    if (!user) {
      const newUser = new CreateUserDto();
      newUser.email = userProfile.email;
      newUser.nick_name = `${userProfile.lastName}${userProfile.firstName}`;
      // ... 추가적인 사용자 정보 설정 ...
      user = await this.userService.create(newUser);
    }
    return user;
  }

  async generateAccessToken(user: any): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    await this.redisService.setAccessToken(user.email, accessToken);
    return accessToken;
  }

  async generateRefreshToken(user: any): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.redisService.setRefreshToken(user.email, refreshToken);
    return refreshToken;
  }
}
