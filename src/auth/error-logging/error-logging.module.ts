// src/auth/error-logging/error-logging.module.ts
import { Module } from '@nestjs/common';
import { SlackService } from './slack/slack.service';
import { AllExceptionsFilter } from './error-logging.service';

@Module({
  providers: [SlackService, AllExceptionsFilter],
  exports: [SlackService, AllExceptionsFilter],
})
export class ErrorLoggingModule {}
