import { Controller, Sse } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { SimpleMessageEvent } from './interface/simple-interface';

@Controller()
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('/sse')
  eventsStream(): Observable<SimpleMessageEvent> {
    return this.sseService.getEventStream();
  }
}
