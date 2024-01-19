import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture])],
  controllers: [LecturesController],
  providers: [LecturesService],
})
export class LecturesModule {}
