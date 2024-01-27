// src/payment/scheduled-payment.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScheduledPaymentService {
  constructor(
    private readonly paymentService: PaymentService,
    private configService: ConfigService,
  ) {}

  @Cron('0 0 1 * *')
  async handleCron() {
    console.log('매월 1일 자동결제 실행');

    const userId = 2;

    try {
      const payment = await this.paymentService.getPaymentByUserId(userId);
      if (!payment || !payment.billing_key || !payment.customer_key) {
        console.log('결제 정보가 없거나 빌링키가 없습니다.');
        return;
      }

      // 토스페이먼츠 결제 API 호출
      const { billing_key: billingKey, customer_key: customerKey } = payment;
      const secretKey = this.configService.get('TOSS_SECRET_KEY');
      const encodedKey = Buffer.from(secretKey).toString('base64');
      const authorizationHeader = `Basic ${encodedKey}`;

      const response = await axios.post(
        `https://api.tosspayments.com/v1/billing/${billingKey}`,
        {
          customerKey,
          amount: 500, // 결제 금액 설정
          // 기타 결제 관련 정보
        },
        {
          headers: {
            'Authorization': authorizationHeader,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('결제 성공:', response.data);
    } catch (error) {
      console.error('결제 실패:', error);
    }
  }
}
