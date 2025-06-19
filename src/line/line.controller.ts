import { Controller, Post, Req, Res, Headers, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { LineService } from './line.service';

@Controller('webhook')
export class LineController {
  constructor(private lineService: LineService) {}

  @Post()
  async webhook(
    @Headers('x-line-signature') sig: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const bodyBuf = (req as any).rawBody;
    const valid = crypto
      .createHmac('SHA256', process.env.LINE_CHANNEL_SECRET!)
      .update(bodyBuf)
      .digest('base64') === sig;

    if (!valid) return res.status(HttpStatus.FORBIDDEN).send('Invalid');

    const evts = req.body.events || [];
    await Promise.all(evts.map(e => this.lineService.handleEvent(e)));

    return res.status(HttpStatus.OK).send('OK');
  }
}
