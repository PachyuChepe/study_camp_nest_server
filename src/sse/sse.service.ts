import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { SimpleMessageEvent } from './interface/simple-interface';

@Injectable()
export class SseService {
  private eventSubject = new Subject<SimpleMessageEvent>();

  getEventStream(): Observable<SimpleMessageEvent> {
    return this.eventSubject.asObservable();
  }

  notifyClients(data: any) {
    const event: SimpleMessageEvent = { data: JSON.stringify(data) };
    this.eventSubject.next(event);
  }
}
