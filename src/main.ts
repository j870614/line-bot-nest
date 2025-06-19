import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  dotenv.config(); // 載入 .env

  const app = await NestFactory.create(AppModule);

  // ✅ 關鍵：保留 rawBody 給 LINE 驗證使用
  app.use(
    bodyParser.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );


  await app.listen(3000);
}
bootstrap();
