// src/line/line.controller.ts
import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { middleware, WebhookRequestBody } from '@line/bot-sdk';
import { LineService } from './line.service';

@Controller('webhook')
export class LineController {
  private lineMiddleware;

  constructor(private readonly lineService: LineService) {
    this.lineMiddleware = middleware({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    });
  }

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    // 手動執行 middleware 驗證
    this.lineMiddleware(req, res, async () => {
      const body = req.body as WebhookRequestBody;
      const events = body.events;

      await Promise.all(events.map(event => this.lineService.handleEvent(event)));
      res.status(200).send('OK');
    });
  }
}
