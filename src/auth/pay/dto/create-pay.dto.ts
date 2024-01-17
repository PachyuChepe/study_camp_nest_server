import { IsNotEmpty } from 'class-validator';

export class CreatePayDto {
  @IsNotEmpty()
  paymentKey: string;

  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  amount: number;
}
