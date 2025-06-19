// src/line/line.service.ts
import { Injectable } from '@nestjs/common';
import { Client, WebhookEvent } from '@line/bot-sdk';

@Injectable()
export class LineService {
  private client: Client;

  constructor() {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const secret = process.env.LINE_CHANNEL_SECRET;

    if (!token || !secret) {
      throw new Error('Missing LINE channel token or secret in .env');
    }

    this.client = new Client({
      channelAccessToken: token,
      channelSecret: secret,
    });
  }

  async handleEvent(event: WebhookEvent): Promise<any> {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userMessage = event.message.text;

      return this.client.replyMessage(replyToken, {
        type: 'text',
        text: `你說的是：${userMessage}`,
      });
    }
    return Promise.resolve(null);
  }
}
