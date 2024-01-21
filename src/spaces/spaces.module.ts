import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { SpaceMembersModule } from 'src/space-members/space-members.module';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';

// https://www.erdcloud.com/d/DXsDN9Jvr5qXuivwz
// space 학습 공간 O
// spaceMembers 학습 공간 멤버 O
// spaceMemberActive 학습 공간 멤버 접속 시간 O
// group 그룹(반,조,수준)
// groupMember 그룹 멤버
// lecture 강의
// lectureItems 강의 영상
// lectureProgress 강의 진도율
@Module({
  imports: [TypeOrmModule.forFeature([Space, SpaceMember]), SpaceMembersModule],
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService],
})
export class SpacesModule {}
//Post space/
//근거가 있는 구조를 만들자.
