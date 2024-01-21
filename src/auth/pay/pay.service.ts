import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { CreatePayDto } from './dto/create-pay.dto';
import { ConfigService } from '@nestjs/config';

// DB 연결 작업은 추후 진행 (현재 엑세스토큰을 받아오지 못함)
@Injectable()
export class PayService {
  private readonly tossUrl = 'https://api.tosspayments.com/v1/payments/';
  constructor(private configService: ConfigService) {}

  async successPay(CreatePayDto: CreatePayDto) {
    const { paymentKey, orderId, amount } = CreatePayDto;

    const secretKey = this.configService.get<string>('TOSS_SECRET_KEY');

    try {
      const response = await axios.post(
        `${this.tossUrl}/${paymentKey}`,
        {
          orderId,
          amount,
        },
        {
          headers: {
            "Authorization":
              'Basic ' + Buffer.from(`${secretKey}:`).toString('base64'),
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Payment processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
