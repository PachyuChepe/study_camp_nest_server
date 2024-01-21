import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture]), MailsModule],
  controllers: [LecturesController],
  providers: [LecturesService],
})
export class LecturesModule {}
