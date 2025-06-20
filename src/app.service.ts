import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '✅ LINE Bot NestJS is running!';
  }
}