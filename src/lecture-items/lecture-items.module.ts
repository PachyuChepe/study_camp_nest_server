import { Module } from '@nestjs/common';
import { LectureItemsController } from './lecture-items.controller';
import { LectureItemsService } from './lecture-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureItem } from './entities/lecture-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LectureItem])],
  controllers: [LectureItemsController],
  providers: [LectureItemsService],
})
export class LectureItemsModule {}
