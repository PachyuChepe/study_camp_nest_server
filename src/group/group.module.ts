import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { SpaceMembersModule } from 'src/space-members/space-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), SpaceMembersModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
