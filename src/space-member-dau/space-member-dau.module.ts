import { Module } from '@nestjs/common';
import { SpaceMemberDauService } from './space-member-dau.service';
import { SpaceMemberDauController } from './space-member-dau.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceMemberDau } from '../space-members/entities/space-member-dau.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceMemberDau])],
  controllers: [SpaceMemberDauController],
  providers: [SpaceMemberDauService],
  exports: [SpaceMemberDauService],
})
export class SpaceMemberDauModule {}
