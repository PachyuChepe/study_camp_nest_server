import { Module } from '@nestjs/common';
import { LectureProgressService } from './lecture-progress.service';
import { LectureProgressController } from './lecture-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureProgress } from './dto/entities/lecture-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LectureProgress])],
  providers: [LectureProgressService],
  controllers: [LectureProgressController],
})
export class LectureProgressModule {}
