// src/auth/error-logging/slack/slack.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SlackService {
  private webhookUrl: string;

  constructor(private configService: ConfigService) {
    this.webhookUrl = configService.get<string>('SLACK_WEBHOOK_URL'); // Slack Webhook URL로 교체
  }

  async sendMessage(text: string) {
    try {
      await axios.post(
        this.webhookUrl,
        {
          text: text,
        },
        {
          headers: {
            'Content-type': 'application/json',
          },
        },
      );
      console.log('Slack에 메시지 전송 완료');
    } catch (error) {
      console.error('Slack Webhook 호출 실패:', error);
    }
  }
}
