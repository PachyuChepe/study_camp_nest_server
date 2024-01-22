import { Injectable } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';

@Injectable()
export class SseService {
  private users$: Subject<any> = new Subject();
  private observer = this.users$.asObservable();

  // 이벤트 발생 함수
  emitAlarmsEvent(userId: number) {
    console.log('이벤트 발생 함수  ===> ', userId);
    // next를 통해 이벤트를 생성
    this.users$.next({ id: userId });
    console.log('next 통과!!!');
  }

  sendClientAlarm(userId: number): Observable<any> {
    console.log('알람 통과!');
    // 이벤트 발생시 처리 로직
    return this.observer.pipe(
      // 유저 필터링
      filter((user) => user.id === userId),
      // 데이터 전송
      map((user) => {
        return {
          data: {
            message: '카드의 담당자가 사용자님으로 변경되었습니다.',
          },
        } as MessageEvent;
      }),
    );
  }
}
