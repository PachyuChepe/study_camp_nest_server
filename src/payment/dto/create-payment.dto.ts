import { IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  // @IsNotEmpty()
  // paymentKey: string;

  // @IsNotEmpty()
  // orderId: string;

  // @IsNotEmpty()
  // amount: number;

  @IsNotEmpty()
  billing_key?: string;

  @IsNotEmpty()
  customer_key?: string;
}
