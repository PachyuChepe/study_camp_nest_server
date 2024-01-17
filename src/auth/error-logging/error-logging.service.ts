// src/auth/error-logging/error-logging.service.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SlackService } from './slack/slack.service';
import moment from 'moment-timezone';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private slackService: SlackService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = 500;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse()['message'] || message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // const now = new Date();
    // now.setHours(now.getHours() + 9);
    const koreaTime = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

    // 스택 트레이스 추출
    // let stackTrace = '';
    // if (exception instanceof Error && exception.stack) {
    //   stackTrace = exception.stack;
    // }

    // Sentry에 예외 로깅
    Sentry.captureException(exception);
    console.log('전역 에러 로깅: ', exception);

    // Slack에 예외 로깅
    this.slackService.sendMessage(`*Nest 서버 에러 발생*
    Path: \`${request.url}\`
    Status Code: \`${status}\`
    Message: \`${message}\`
    Timestamp: \`${koreaTime}\`
    `);

    response.status(status).json({
      path: request.url,
      statusCode: status,
      message: message,
      timestamp: koreaTime,
    });
  }
}
