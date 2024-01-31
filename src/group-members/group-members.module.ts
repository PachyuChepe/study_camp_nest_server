import { Module } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { GroupMembersController } from './group-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-members.entity';
import { SpaceMembersModule } from 'src/space-members/space-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember]), SpaceMembersModule],
  providers: [GroupMembersService],
  controllers: [GroupMembersController],
  exports: [GroupMembersService],
})
export class GroupMembersModule {}
