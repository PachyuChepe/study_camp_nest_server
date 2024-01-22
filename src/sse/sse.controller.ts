import { Controller, Param, Sse } from '@nestjs/common';
import { SseService } from './sse.service';
// import { Observable, interval, map } from 'rxjs'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse(':userId')
  sendClientAlarm(@Param('userId') userId: string) {
    return this.sseService.sendClientAlarm(+userId);
  }
}
