// src/payment/payment.service.ts
import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { SpacesModule } from 'src/spaces/spaces.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User]),
    forwardRef(() => SpacesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [PaymentController],
  exports: [PaymentService],
  providers: [PaymentService],
})
export class PaymentModule {}
