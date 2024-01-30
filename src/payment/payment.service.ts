// src/payment/payment.service.ts
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UsersService } from 'src/users/users.service';
import { SpacesService } from 'src/spaces/spaces.service';
import { v1 as uuidv1 } from 'uuid';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private spacesService: SpacesService,
    private configService: ConfigService,
  ) {}

  async createPayment(
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    const payment = this.paymentRepository.create({
      user: { id: userId },
      billing_key: createPaymentDto.billing_key,
      customer_key: createPaymentDto.customer_key,
    });
    return this.paymentRepository.save(payment);
  }

  async getPaymentByUserId(userId: number): Promise<Payment> {
    return await this.paymentRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async createBillingKey(
    authKey: string,
    customerKey: string,
    classId: string,
    spaceName: string,
    content: string,
    password: string,
    email: string,
  ): Promise<string> {
    const secretKey = this.configService.get('TOSS_SECRET_KEY');
    const encodedKey = Buffer.from(secretKey).toString('base64');
    const authorizationHeader = `Basic ${encodedKey}`;

    try {
      const response = await axios.post(
        'https://api.tosspayments.com/v1/billing/authorizations/issue',
        { authKey, customerKey },
        {
          headers: {
            'Authorization': authorizationHeader,
            'Content-Type': 'application/json',
          },
        },
      );

      const billingKey = response.data.billingKey;
      console.log('떳냐!?', billingKey);
      // billingKey를 데이터베이스에 저장하는 로직 추가
      await this.saveBillingKey(customerKey, billingKey);

      await this.executePayment(
        billingKey,
        customerKey,
        classId,
        spaceName,
        content,
        password,
        email,
      );

      return billingKey;
    } catch (error) {
      console.error(error);
      throw new Error('빌링키 생성 실패');
    }
  }

  private async saveBillingKey(
    customerKey: string,
    billingKey: string,
  ): Promise<void> {
    // Payment 엔티티에 billingKey 저장 로직
    const payment = await this.paymentRepository.findOne({
      where: { customer_key: customerKey },
    });
    if (payment) {
      payment.billing_key = billingKey;
      await this.paymentRepository.save(payment);
    } else {
      // 새 Payment 엔티티 생성
      const newPayment = this.paymentRepository.create({
        customer_key: customerKey,
        billing_key: billingKey,
      });
      await this.paymentRepository.save(newPayment);
    }
  }

  private async executePayment(
    billingKey: string,
    customerKey: string,
    classId: string,
    spaceName: string,
    spaceContent: string,
    spacePassword: string,
    email: string,
  ): Promise<void> {
    // 결제 API 호출
    console.log('billingKey 결제구현중', billingKey);
    console.log('customerKey 결제구현중', customerKey);
    console.log('classId 결제구현중', classId);
    console.log('spaceName 결제구현중', spaceName);
    console.log('email 결제구현중', email);
    const secretKey = this.configService.get('TOSS_SECRET_KEY');
    const encodedKey = Buffer.from(secretKey).toString('base64');
    const authorizationHeader = `Basic ${encodedKey}`;
    const user = await this.usersService.findOne(email);
    const space = await this.spacesService.findSpaceClassById(
      parseInt(classId),
    );

    try {
      await axios.post(
        `https://api.tosspayments.com/v1/billing/${billingKey}`,
        {
          customerKey,
          amount: space.price,
          orderId: uuidv1(),
          orderName: space.name,
          customerName: user.nick_name,
          customerEmail: user.email,
        },
        {
          headers: {
            'Authorization': authorizationHeader,
            'Content-Type': 'application/json',
          },
        },
      );
      await this.spacesService.createSpace(
        spaceName,
        parseInt(classId),
        spaceContent,
        spacePassword,
        user.id,
      );
    } catch (error) {
      console.error('결제 실패:', error);
      throw new Error('결제 실행 실패');
    }
  }
}
