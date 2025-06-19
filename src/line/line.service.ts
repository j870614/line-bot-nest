// src/line/line.service.ts
import { Injectable } from '@nestjs/common';
import { Client, middleware, WebhookEvent } from '@line/bot-sdk';

@Injectable()
export class LineService {
  private client: Client;

  constructor() {
    this.client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
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
