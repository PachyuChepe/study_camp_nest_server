// src/users/users.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaymentService } from 'src/payment/payment.service';
import { v4 as uuidv4 } from 'uuid';
import { randomInt } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
    });

    // 난수로 속성 설정
    newUser.skin = randomInt(0, 13); // 0~12
    newUser.hair = randomInt(0, 10); // 0~9
    newUser.hair_color = randomInt(0, 12); // 0~11
    newUser.clothes = randomInt(0, 7); // 0~6
    newUser.clothes_color = randomInt(0, 12); // 0~11
    newUser.face = randomInt(0, 65); // 0~64

    const savedUser = await this.userRepository.save(newUser);

    // savedUser의 ID를 customerKey로 사용
    const customerKey = `${uuidv4()}${savedUser.id}`;

    // Payment 엔티티 생성
    await this.paymentService.createPayment(savedUser.id, {
      customer_key: customerKey,
    });

    return savedUser;
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'nick_name',
        'point',
        'skin',
        'hair',
        'face',
        'clothes',
        'hair_color',
        'clothes_color',
      ],
    });
    if (!user) {
      throw new NotFoundException(
        `이메일이 ${email}인 사용자를 찾을 수 없습니다.`,
      );
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new NotFoundException('이미 가입된 이메일입니다.');
    }
    return user;
  }

  async findByEmailGoogle(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findAll() {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'nick_name',
        'point',
        'skin',
        'hair',
        'face',
        'clothes',
        'hair_color',
        'clothes_color',
      ],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`ID가 ${id}인 사용자를 찾을 수 없습니다.`);
    }

    if (
      updateUserDto.skin !== undefined &&
      (updateUserDto.skin < 0 || updateUserDto.skin > 12)
    ) {
      throw new BadRequestException('skin 값이 범위를 벗어났습니다.');
    }

    if (
      updateUserDto.hair !== undefined &&
      (updateUserDto.hair < 0 || updateUserDto.hair > 9)
    ) {
      throw new BadRequestException('hair 값이 범위를 벗어났습니다.');
    }

    if (
      updateUserDto.face !== undefined &&
      (updateUserDto.face < 0 || updateUserDto.face > 64)
    ) {
      throw new BadRequestException('face 값이 범위를 벗어났습니다.');
    }

    if (
      updateUserDto.clothes !== undefined &&
      (updateUserDto.clothes < 0 || updateUserDto.clothes > 6)
    ) {
      throw new BadRequestException('clothes 값이 범위를 벗어났습니다.');
    }

    if (
      updateUserDto.hair_color !== undefined &&
      (updateUserDto.hair_color < 0 || updateUserDto.hair_color > 11)
    ) {
      throw new BadRequestException('hair_color 값이 범위를 벗어났습니다.');
    }

    if (
      updateUserDto.clothes_color !== undefined &&
      (updateUserDto.clothes_color < 0 || updateUserDto.clothes_color > 11)
    ) {
      throw new BadRequestException('clothes_color 값이 범위를 벗어났습니다.');
    }

    await this.userRepository.save({ ...user, ...updateUserDto });
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ID가 ${id}인 사용자를 찾을 수 없습니다.`);
    }
  }
}
