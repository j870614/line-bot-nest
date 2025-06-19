// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // 載入 .env
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json());
  await app.listen(3000);
}
bootstrap();
