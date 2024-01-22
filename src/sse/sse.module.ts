import { Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';
// import { AlarmsModule } from 'src/alarms/alarms.module'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리

@Module({
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
