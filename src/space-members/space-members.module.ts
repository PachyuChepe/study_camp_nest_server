import { Module } from '@nestjs/common';
import { SpaceMembersService } from './space-members.service';
import { SpaceMembersController } from './space-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceMember } from './entities/space-member.entity';
import { SpaceMemberDauModule } from 'src/space-member-dau/space-member-dau.module';
import { Space } from '../spaces/entities/space.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceMember, Space]),
    SpaceMemberDauModule,
  ],
  controllers: [SpaceMembersController],
  providers: [SpaceMembersService],
  exports: [SpaceMembersService],
})
export class SpaceMembersModule {}
