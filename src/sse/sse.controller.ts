import { Controller, Param, Sse } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable, interval, map } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse(':userId')
  sendClientAlarm(@Param('userId') userId: string) {
    return this.sseService.sendClientAlarm(+userId);
  }
}
